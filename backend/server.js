// backend/server.js
import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
//const fetch = require("node-fetch");

app.use(express.json());
app.use(cors());

/**
 * Get access token from Camunda OAuth
 */
async function getAccessToken() {
  const params = new URLSearchParams();
  params.append("grant_type", "client_credentials");
  params.append("client_id", process.env.CLIENT_ID);
  params.append("client_secret", process.env.CLIENT_SECRET);
  params.append("audience", "tasklist.camunda.io");

  const res = await fetch("https://login.cloud.camunda.io/oauth/token", {
    method: "POST",
    body: params,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`OAuth failed: ${res.status} - ${text}`);
  }

  const data = await res.json();
  return data.access_token;
}

/**
 * Complete a task
 */
// ✅ Complete task
app.post("/camunda/tasks/:taskId/complete", async (req, res) => {
  const { taskId } = req.params;
  console.log("Completing userTaskKey:", taskId);

  try {
    const token = await getAccessToken();

    const response = await fetch(
      `${process.env.CAMUNDA_BASE_URL}/${process.env.CLUSTER_ID}/v2/user-tasks/${taskId}/completion`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          req.body || { variables: { paperworkDecision: "accept | reject" } },
        ),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Task complete failed:", errorText);

      // 👇 stop execution here so `res.json` doesn't run again
      return res
        .status(response.status)
        .json({ error: "Task complete failed", details: errorText });
    }
    console.log("TaskId received from UI:", taskId);
    // ✅ success case → only one response
    res.json({ message: "✅ Task completed", taskId });
  } catch (err) {
    console.error("❌ Task complete failed (server error):", err.message);

    // ✅ only one response in catch
    if (!res.headersSent) {
      res
        .status(500)
        .json({ error: "Task complete failed", details: err.message });
    }
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
