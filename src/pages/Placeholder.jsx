import React from "react";
import { Card } from "react-bootstrap";

export default function Placeholder({ title = "Page" }) {
  return (
    <Card className="shadow-sm">
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <div className="text-muted">
          This section is not wired yet. Add content here.
        </div>
      </Card.Body>
    </Card>
  );
}
