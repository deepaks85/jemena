import React from "react";

export default function StatusBadge({ status }) {
  const s = (status || "").toLowerCase();

  let badgeClass = "bg-secondary";

  if (s === "open") badgeClass = "bg-success";
  else if (s === "created") badgeClass = "bg-primary";
  else if (s === "in progress") badgeClass = "bg-primary";
  else if (s === "completed") badgeClass = "bg-success";
  else if (s === "breached") badgeClass = "bg-danger";
  else if (s === "canceled") badgeClass = "bg-danger";
  else if (s === "expiring") badgeClass = "bg-warning text-dark";
  else if (s === "on time") badgeClass = "bg-success";

  return <span className={`badge ${badgeClass} px-3 py-2`}>{status}</span>;
}
