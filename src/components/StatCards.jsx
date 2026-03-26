// src/components/StatCards.jsx
import React from "react";
import { Row, Col } from "react-bootstrap";
import StatCard from "./StatCard";

/**
 * Renders KPI cards in a responsive grid:
 * xs: 1 per row
 * sm: 2 per row
 * md: 3 per row
 * lg: 4 per row
 * xl+: 6 per row  <-- KEY CHANGE
 */
export default function StatCards({ kpis = [], limit, xl = 2 }) {
  const displayKpis = limit ? kpis.slice(0, limit) : kpis;
  const getVariant = (id) => {
    switch (id) {
      case "activeProcesses":
        return "primary";
      case "pendingSla":
        return "warning";
      case "openTasks":
        return "success";
      case "failedToday":
        return "danger";

      // new task KPIs
      case "activeTasks":
        return "primary"; // blue
      case "awaitingCompletion":
        return "info"; // light blue
      case "escalated":
        return "danger"; // red
      case "expiringSoon":
        return "warning"; // yellow/orange

      default:
        return "secondary";
    }
  };

  return (
    <Row className="g-3 mb-4">
      {displayKpis.map((k) => (
        <Col
          key={k.id}
          xs={12} // 1 per row on extra small
          sm={6} // 2 per row on small
          md={4} // 3 per row on medium
          lg={3} // 4 per row on large
          xl={xl} // 6 per row on extra large (12/2 = 6 columns)
        >
          <StatCard
            icon={k.icon}
            label={k.label}
            value={k.value}
            delta={k.delta}
            variant={k.variant || getVariant(k.id, k.value)}
          />
        </Col>
      ))}
    </Row>
  );
}
