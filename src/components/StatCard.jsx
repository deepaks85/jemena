import React from "react";
import { Card } from "react-bootstrap";

export default function StatCard({
  icon,
  label,
  value,
  delta,
  variant = "secondary",
}) {
  // const textClass = `text-${variant}`;

  const getTrendIcon = (val) => {
    if (typeof val === "string") {
      if (val.includes("+")) return "bi-arrow-up";
      if (val.includes("-")) return "bi-arrow-down";
    }
    return null;
  };

  const getTrendVariant = (val, fallback) => {
    if (typeof val === "string") {
      if (val.includes("+")) return "success";
      if (val.includes("-")) return "danger";
    }
    return fallback;
  };

  const finalVariant = getTrendVariant(value, variant);
  const textClass = `text-${finalVariant}`;
  const trendIcon = getTrendIcon(value);

  const borderColor =
    finalVariant === "danger"
      ? "#dc3545"
      : variant === "warning"
        ? "#fd7e14"
        : variant === "success"
          ? "#198754"
          : variant === "primary"
            ? "#0d6efd"
            : "#6c757d";

  // number formatting

  const formatValue = (val) => {
    if (val === null || val === undefined) return "-";

    // If already contains % → return as is
    if (typeof val === "string" && val.includes("%")) {
      return val;
    }

    // If numeric string or number
    if (!isNaN(val)) {
      return Number(val).toLocaleString();
    }

    // fallback (string like AES)
    return val;
  };

  return (
    <Card
      className="shadow-sm kpi-card h-100 rounded-4 position-relative"
      style={{ borderLeft: `3px solid ${borderColor}` }}
    >
      <Card.Body className="p-3">
        {/* Icon */}
        <div className={`stat-icon-bg icon-bg-${variant} text-${variant}`}>
          <i className={`bi ${icon}`} />
        </div>

        {/* Content */}
        <div>
          <div className={`fw-semibold small pe-5 text-wrap`}>{label}</div>

          <div className={`fs-1 fw-bold ${textClass}`}>
            {trendIcon && <i className={`bi ${trendIcon} fs-2 me-1`} />}
            {formatValue(value)}
          </div>

          <div className="kpi-delta text-muted small">{delta}</div>
        </div>
      </Card.Body>
    </Card>
  );
}
