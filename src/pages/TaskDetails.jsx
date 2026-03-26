import { useEffect, useState } from "react";
import { Card, Table, Spinner, Button, Modal } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { getTaskDetails } from "../services/dataservice";
import ErrorState from "../components/ErrorState";
import useGlobalRefresh from "../hooks/useGlobalRefresh";

export default function TaskDetails() {
  const { taskId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastSynced, setLastSynced] = useState(null);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const fetchTaskDetails = async () => {
    try {
      setLoading(true);

      const res = await getTaskDetails(taskId);
      setData(res);
      setLastSynced(new Date().toLocaleString());
    } catch (err) {
      console.error(err);
      setError("Failed to load task details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTaskDetails();
  }, [taskId]);

  useGlobalRefresh(fetchTaskDetails);

  // camunda actions

  const completeTask = async (taskId) => {
    try {
      const res = await fetch(
        `https://slashingly-untransgressed-linwood.ngrok-free.dev/msi/v1/process/tasks/${taskId}/complete`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            variables: {
              paperworkDecision: taskId === "complete" ? "accept" : "reject",
              lsnApprovalStatus: taskId === "complete" ? "accept" : "reject",
            },
          }),
        },
      );

      if (!res.ok) throw new Error(await res.text());

      // ✅ Instant UI update
      setData((prev) => ({
        ...prev,
        status: "COMPLETED",
      }));

      setModalMessage("Task completed successfully");
      setShowModal(true);
    } catch (err) {
      console.error(err);
      setModalMessage("Task completion failed");
      setShowModal(true);
    } finally {
    }
  };

  const rejectTask = async (taskId) => {
    try {
      const res = await fetch(
        `https://slashingly-untransgressed-linwood.ngrok-free.dev/msi/v1/process/tasks/${taskId}/complete`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            variables: {
              paperworkDecision: taskId === "complete" ? "accept" : "reject",
              lsnApprovalStatus: taskId === "complete" ? "accept" : "reject",
            },
          }),
        },
      );

      if (!res.ok) throw new Error(await res.text());

      // ✅ Instant UI update
      setData((prev) => ({
        ...prev,
        status: "REJECTED",
      }));

      setModalMessage("Task rejected successfully.");
      setShowModal(true);
    } catch (err) {
      console.error(err);
      setModalMessage("Task reject failed.");
      setShowModal(true);
    } finally {
    }
  };

  const handleModalClose = () => {
    setShowModal(false);

    setTimeout(() => {
      fetchTaskDetails();
    }, 500);
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner />
      </div>
    );
  }

  if (!data) {
    return <div className="text-center mt-5">No data found</div>;
  }

  return (
    <>
      {/* Breadcrumb */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="d-flex align-items-center gap-2 small">
          <Link to="/" className="text-decoration-none">
            Dashboard
          </Link>

          <i className="bi bi-chevron-right small"></i>

          <Link to="/tasks" className="text-decoration-none">
            Tasks
          </Link>

          <i className="bi bi-chevron-right small"></i>

          <span className="text-muted">Task #{taskId}</span>
        </div>

        <div className="text-muted small">Last synced: {lastSynced || "—"}</div>
      </div>

      {/* Page Title */}
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h2 className="mb-0">Task Details - Validate Paper Work</h2>
      </div>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h5>Task ID: {data.taskId}</h5>
        <div className="d-flex gap-2 mt-3">
          <Button
            variant="success"
            disabled={data.status === "COMPLETED"}
            onClick={() => completeTask(data.taskId)}
          >
            <i className="bi bi-check-circle me-2"></i>
            Accept
          </Button>

          <Button
            variant="danger"
            disabled={data.status === "COMPLETED"}
            onClick={() => rejectTask(data.taskId)}
          >
            <i className="bi bi-x-circle me-2"></i>
            Reject
          </Button>
        </div>
      </div>

      {error && <ErrorState message={error} />}

      {/* Metadata Card */}
      <Card className="mb-4 rounded-4">
        <Card.Body className="rounded-4">
          <Table responsive className="mb-0">
            <tbody>
              <tr>
                <td className="fw-semibold" width="30%">
                  Task Name
                </td>
                <td>{data.taskName}</td>
              </tr>

              <tr>
                <td className="fw-semibold">Process Type</td>
                <td>{data.processType}</td>
              </tr>

              {/* <tr>
                <td className="fw-semibold">Service Order</td>
                <td>{data.soId}</td>
              </tr> */}

              <tr>
                <td className="fw-semibold">Status</td>
                <td>{data.status}</td>
              </tr>

              <tr>
                <td className="fw-semibold">Task Status</td>
                <td>{data.transactionStatus}</td>
              </tr>

              <tr>
                <td className="fw-semibold">Assigned To</td>
                <td>{data.assignedTo || "Unassigned"}</td>
              </tr>

              <tr>
                <td className="fw-semibold">NMI</td>
                <td>{data.nmi}</td>
              </tr>

              {/* <tr>
                <td className="fw-semibold">NMI Location</td>
                <td>{data.nmiLocation || "—"}</td>
              </tr> */}

              <tr>
                <td className="fw-semibold">Created Date</td>
                <td>{data.createdAt}</td>
              </tr>

              <tr>
                <td className="fw-semibold">Completed Date</td>
                <td>{data.completedAt}</td>
              </tr>

              <tr>
                <td className="fw-semibold">Due At</td>
                <td>{data.dueAt}</td>
              </tr>
            </tbody>
          </Table>
        </Card.Body>
      </Card>
      {/* Modal popup message alert*/}
      <Modal
        show={showModal}
        onHide={() => {
          setShowModal(false);
          fetchTaskDetails(); // refresh after closing modal
        }}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Task Update</Modal.Title>
        </Modal.Header>

        <Modal.Body>{modalMessage}</Modal.Body>

        <Modal.Footer>
          <Button variant="primary" onClick={handleModalClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
