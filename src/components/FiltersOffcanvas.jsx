import React, { useState, useEffect } from "react";
import { Offcanvas, Button, Form, Row, Col, Stack } from "react-bootstrap";

export default function FiltersOffcanvas({
  show,
  onClose,
  master = {},
  value,
  onApply,
  onClear,
}) {
  const [draft, setDraft] = useState(value || {});

  useEffect(() => {
    setDraft(value || {});
  }, [value]);

  const update = (key, val) => setDraft((prev) => ({ ...prev, [key]: val }));

  const multiSelect = (label, key, options) => (
    <Form.Group className="mb-3" controlId={`f-${key}`}>
      <Form.Label className="fw-semibold">{label}</Form.Label>
      <div
        className="border rounded p-2"
        style={{ maxHeight: 160, overflowY: "auto" }}
      >
        {options.map((opt) => {
          const arr = draft[key] || [];
          const checked = arr.includes(opt);
          return (
            <Form.Check
              key={opt}
              type="checkbox"
              label={opt}
              checked={checked}
              onChange={(e) => {
                const next = e.target.checked
                  ? [...arr, opt]
                  : arr.filter((x) => x !== opt);
                update(key, next);
              }}
            />
          );
        })}
      </div>
    </Form.Group>
  );

  return (
    <Offcanvas show={show} onHide={onClose} placement="end">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Filters</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <Row>
          <Col xs={12}>
            {Object.entries(master).map(([key, options]) =>
              multiSelect(
                key
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (s) => s.toUpperCase()), // label formatting
                key,
                options || [],
              ),
            )}
          </Col>
        </Row>

        <Stack direction="horizontal" gap={2} className="mt-3">
          <Button variant="primary" onClick={() => onApply(draft)}>
            Apply
          </Button>
          <Button variant="outline-secondary" onClick={onClear}>
            Clear
          </Button>
          <div className="ms-auto">
            <Button variant="light" onClick={onClose}>
              Close
            </Button>
          </div>
        </Stack>
      </Offcanvas.Body>
    </Offcanvas>
  );
}
