import React from "react";
import { Badge } from "react-bootstrap";

export default function SlaBadge({ value }) {
  const v = (value || "").toLowerCase();
  const variant =
    v === "breached" ? "danger" : v === "expiring" ? "warning" : "success";
  return <Badge bg={variant}>{value}</Badge>;
}
