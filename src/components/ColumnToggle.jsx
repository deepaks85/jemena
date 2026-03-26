import React from "react";
import { Dropdown, Form } from "react-bootstrap";

export default function ColumnToggle({ columns, onToggle }) {
  return (
    <Dropdown align="end">
      <Dropdown.Toggle
        className="rounded-3"
        variant="outline-secondary"
        size="sm"
      >
        <i className="bi bi-layout-three-columns me-1" /> Columns
      </Dropdown.Toggle>
      <Dropdown.Menu style={{ minWidth: 240 }}>
        {columns.map((col) => (
          <Dropdown.Item key={col.key} as="div" className="py-1">
            <Form.Check
              type="checkbox"
              id={`col-${col.key}`}
              label={col.label}
              checked={col.visible !== false}
              onChange={() => onToggle(col.key)}
            />
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
}
