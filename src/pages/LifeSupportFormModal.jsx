import React, { useState } from "react";
import { Modal, Button, Alert } from "react-bootstrap";

export default function LifeSupportFormModal({
  show,
  onClose,
  onSuccess,
  children,
}) {
  const [status, setStatus] = useState(null); // success | error
  const [message, setMessage] = useState("");

  const handleSuccess = (msg = "Request submitted successfully") => {
    setStatus("success");
    setMessage(msg);
    onSuccess && onSuccess();
  };

  const handleError = (msg = "Something went wrong") => {
    setStatus("error");
    setMessage(msg);
  };

  return (
    <Modal show={show} onHide={onClose} centered size="md">
      <Modal.Header closeButton>
        <Modal.Title>Life Support Request Form</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {/* ✅ Status Message */}
        {status === "success" && <Alert variant="success">{message}</Alert>}

        {status === "error" && <Alert variant="danger">{message}</Alert>}

        {/* ✅ Inject Form */}
        {children({ handleSuccess, handleError })}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
