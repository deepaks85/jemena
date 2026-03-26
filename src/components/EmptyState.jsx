import React from "react";
import { Alert } from "react-bootstrap";

export default function EmptyState({
  title = "No data to show",
  message = "Try adjusting filters.",
}) {
  return (
    <Alert variant="light" className="text-center">
      <i className="bi bi-inbox me-2"></i>
      <span className="fw-semibold">{title}</span>
      <div className="small text-muted">{message}</div>
    </Alert>
  );
}
