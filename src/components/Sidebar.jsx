import React from "react";
import { Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import logo from "../assets/jemena-logo.png";

const items = [
  { to: "/dashboard", label: "Dashboard", icon: "bi-speedometer2" },
  // { to: "/notifications", label: "Notifications", icon: "bi-bell", badge: 0 },
  { to: "/life-support", label: "Life Support", icon: "bi-heart-pulse" },
  {
    to: "/service-orders",
    label: "Service Orders",
    icon: "bi-clipboard-check",
  },
  {
    to: "/life-support-notifications",
    label: "Life Support Notifications",
    icon: "bi-bell",
  },
  {
    to: "/cats-request",
    label: "CATS Change Request",
    icon: "bi-arrow-repeat",
  },
  { to: "/tasks", label: "Tasks", icon: "bi-list-task" },
  // { to: "/transactions", label: "Transactions", icon: "bi-shuffle" },
  // { to: "/processes", label: "Processes", icon: "bi-diagram-3" },
  // { to: "/misc", label: "Misc", icon: "bi-three-dots" },
];

export default function Sidebar() {
  return (
    <aside className="sidebar p-3 d-flex flex-column">
      <div className="d-flex align-items-center gap-2 mb-4">
        <img src={logo} alt="Jemena" height={40} />
      </div>

      <Nav className="flex-column gap-1">
        {items.map((it) => (
          <Nav.Link
            as={NavLink}
            to={it.to}
            key={it.to}
            className="d-flex justify-content-between align-items-center"
          >
            <span>
              <i className={`bi ${it.icon} me-2`} />
              {it.label}
            </span>
            {it.badge ? (
              <span className="badge text-bg-danger">{it.badge}</span>
            ) : null}
          </Nav.Link>
        ))}
      </Nav>

      <div className="mt-auto pt-3">
        <Nav.Link as={NavLink} to="/settings">
          <i className="bi bi-gear me-2"></i>Settings
        </Nav.Link>
      </div>
    </aside>
  );
}
