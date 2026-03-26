import React from "react";
import { Alert } from "react-bootstrap";

export default function ErrorState({
  title = "Something went wrong",
  message = "Please try again.",
}) {
  return (
    <Alert variant="danger" className="d-flex align-items-center gap-2">
      <i className="bi bi-x-octagon-fill me-1"></i>
      <div>
        <div className="fw-semibold">{title}</div>
        <div className="small">{message}</div>
      </div>
    </Alert>
  );
}
