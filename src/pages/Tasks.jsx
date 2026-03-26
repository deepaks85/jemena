import React, { useEffect, useState } from "react";
import { Spinner, Modal, Button } from "react-bootstrap";
import StatCards from "../components/StatCards";
import StatusBadge from "../components/StatusBadge";
import ErrorState from "../components/ErrorState";
import { Link } from "react-router-dom";
import useGlobalRefresh from "../hooks/useGlobalRefresh";
import DataTable from "../components/DataTable";
import { getTasks } from "../services/dataservice";

export default function Tasks() {
  const [raw, setRaw] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [pendingUpdate, setPendingUpdate] = useState(null);
  const [failedTasks, setFailedTasks] = useState([]);

  const load = async () => {
    try {
      setLoading(true);
      const data = await getTasks();

      setRaw({
        ...data,
        lastSynced: new Date().toISOString(),
      });

      setError(null);
    } catch (e) {
      setError(e?.message || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  useGlobalRefresh(load);

  const handleSelect = (taskId, checked) => {
    setSelectedTasks((prev) =>
      checked ? [...prev, taskId] : prev.filter((id) => id !== taskId),
    );
  };

  const handleBulkAction = async (action) => {
    try {
      const results = await Promise.allSettled(
        selectedTasks.map((taskId) =>
          fetch(
            `https://slashingly-untransgressed-linwood.ngrok-free.dev/msi/v1/process/tasks/${taskId}/complete`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "ngrok-skip-browser-warning": "true",
              },
              body: JSON.stringify({
                variables: {
                  paperworkDecision:
                    action === "complete" ? "accept" : "reject",
                  lsnApprovalStatus:
                    action === "complete" ? "accept" : "reject",
                },
              }),
            },
          ),
        ),
      );

      const successIds = [];
      const failedIds = [];

      results.forEach((res, index) => {
        if (res.status === "fulfilled" && res.value.ok) {
          successIds.push(selectedTasks[index]);
        } else {
          failedIds.push(selectedTasks[index]);
        }
      });

      // store for later update
      setPendingUpdate({ action, successIds });
      setFailedTasks(failedIds);

      // dynamic message
      setModalMessage(
        `${successIds.length} succeeded, ${failedIds.length} failed`,
      );

      setShowModal(true);
    } catch (err) {
      console.error(err);
      setModalMessage("Bulk action failed completely");
      setShowModal(true);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);

    if (pendingUpdate) {
      const { action, successIds } = pendingUpdate;

      setRaw((prev) => ({
        ...prev,
        tasks: prev.tasks.map((task) =>
          successIds.includes(task.taskId)
            ? {
                ...task,
                status: action === "complete" ? "COMPLETED" : "REJECTED",
              }
            : task,
        ),
      }));

      // remove only successful ones from selection
      setSelectedTasks((prev) => prev.filter((id) => !successIds.includes(id)));

      setPendingUpdate(null);
      setFailedTasks([]);
    }
  };

  const taskKpis = raw?.stats
    ? [
        {
          id: "activeTasks",
          label: "Active Tasks",
          value: raw.stats.activeTasks,
          icon: "bi-list-task",
        },
        {
          id: "awaitingCompletion",
          label: "Awaiting Completion",
          value: raw.stats.awaitingCompletion,
          icon: "bi-hourglass-split",
        },
        {
          id: "escalated",
          label: "Escalated",
          value: raw.stats.escalated,
          icon: "bi-exclamation-triangle",
        },
        {
          id: "expiringSoon",
          label: "Expiring Soon",
          value: raw.stats.expiringSoon,
          icon: "bi-clock-history",
        },
      ]
    : [];

  return (
    <>
      <div className="d-flex align-items-center justify-content-between">
        <h2 className="mb-0">Tasks</h2>
        <div className="text-muted small">
          Last synced:{" "}
          {raw?.lastSynced ? new Date(raw.lastSynced).toLocaleString() : "—"}
        </div>
      </div>
      <div className="d-flex gap-2 mb-3 align-items-center justify-content-end">
        <button
          className="btn btn-success"
          disabled={selectedTasks.length === 0}
          onClick={() => handleBulkAction("complete")}
        >
          <i className="bi bi-check-circle me-1"></i>
          Accept
        </button>

        <button
          className="btn btn-danger"
          disabled={selectedTasks.length === 0}
          onClick={() => handleBulkAction("reject")}
        >
          <i className="bi bi-x-circle me-1"></i>
          Reject
        </button>
      </div>

      {loading && (
        <div className="d-flex align-items-center justify-content-center my-5">
          <Spinner animation="border" size="sm" className="me-2" />
          <span>Loading Tasks…</span>
        </div>
      )}

      {error && <ErrorState message={error} />}

      {!loading && !error && raw && (
        <>
          {taskKpis.length > 0 && (
            <StatCards kpis={taskKpis} limit={4} xl={3} />
          )}

          <DataTable
            title="Tasks"
            data={raw.tasks || []}
            rowKey="taskId"
            exportFileName="tasks"
            columns={[
              {
                key: "select",
                label: "",
                visible: true,
                width: "40px",
              },
              {
                key: "dueBy",
                label: "Due By",
                visible: true,
                width: "120px",
                sortable: true,
              },
              {
                key: "taskId",
                label: "Task Id",
                visible: true,
                width: "140px",
                sortable: true,
              },
              {
                key: "taskType",
                label: "Task Type",
                visible: true,
                width: "180px",
                sortable: true,
              },
              {
                key: "soNumber",
                label: "SO#",
                visible: true,
                width: "80px",
                sortable: true,
              },
              {
                key: "nmi",
                label: "NMI",
                visible: true,
                width: "100px",
                sortable: true,
              },
              {
                key: "status",
                label: "Status",
                visible: true,
                width: "100px",
                sortable: true,
              },
              {
                key: "assignedTo",
                label: "Assigned To",
                visible: true,
                width: "240px",
                sortable: true,
              },
            ]}
            searchFields={[
              "taskId",
              "nmi",
              "taskType",
              "soNumber",
              "status",
              "assignedTo",
            ]}
            filterFields={["taskType", "assignedTo", "status"]}
            renderCell={(key, row) => {
              if (key === "select") {
                if (row.status !== "CREATED") return null;

                return (
                  <input
                    type="checkbox"
                    checked={selectedTasks.includes(row.taskId)}
                    onChange={(e) => handleSelect(row.taskId, e.target.checked)}
                  />
                );
              }
              if (key === "taskId") {
                return (
                  <Link
                    to={`/tasks/${row.taskId}`}
                    className="text-decoration-none fw-semibold"
                  >
                    {row.taskId}
                  </Link>
                );
              }

              if (key === "status") {
                return <StatusBadge status={row.status} />;
              }

              return row[key];
            }}
          />
        </>
      )}

      <Modal show={showModal} onHide={handleModalClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Task Update</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div>{modalMessage}</div>

          {failedTasks.length > 0 && (
            <div className="mt-3">
              <div className="fw-semibold text-danger mb-1">
                Failed Task IDs:
              </div>
              <ul className="mb-0">
                {failedTasks.map((id) => (
                  <li key={id}>{id}</li>
                ))}
              </ul>
            </div>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="primary" onClick={handleModalClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
