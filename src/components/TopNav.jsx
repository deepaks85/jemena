import React from "react";
import {
  Navbar,
  Container,
  Button,
  Dropdown,
  Form,
  InputGroup,
} from "react-bootstrap";
import Avatar from "./Avatar";

export default function TopNav({
  network = "All",
  onNetworkChange = () => {},
  search = "",
  onSearchChange = () => {},
  onRefresh = () => {},
}) {
  return (
    <Navbar className="topnav" expand="lg">
      <Container fluid className="py-2">
        {/* Left: filters */}
        <div className="d-flex align-items-center gap-2">
          <Dropdown>
            <Dropdown.Toggle
              variant="outline-secondary"
              className="rounded-3"
              size="sm"
            >
              {network}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {["All", "Electricity", "Gas", "Transmission"].map((opt) => (
                <Dropdown.Item key={opt} onClick={() => onNetworkChange(opt)}>
                  {opt}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>

          {/* <InputGroup size="sm" className="ms-2" style={{ maxWidth: 380 }}>
            <InputGroup.Text className="bg-white border-end-0">
              <i className="bi bi-search" />
            </InputGroup.Text>
            <Form.Control
              placeholder="Search all ID"
              className="border-start-0"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </InputGroup> */}

          <div style={{ position: "relative" }}>
            <i
              className="bi bi-search"
              style={{
                position: "absolute",
                top: "50%",
                left: "10px",
                transform: "translateY(-50%)",
                color: "#222",
                fontSize: "12px",
              }}
            />

            <Form.Control
              type="text"
              placeholder={`Search all ID`}
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              style={{
                height: "33px",
                borderRadius: "8px",
                paddingLeft: "30px",
                border: "1px solid #888",
                fontSize: "12px",
              }}
            />
          </div>
        </div>

        {/* Right: actions */}
        <div className="d-flex align-items-center gap-3">
          <Button
            variant="outline-primary"
            size="sm"
            onClick={() => window.dispatchEvent(new Event("appRefresh"))}
            className="rounded-3 p-2 px-3"
          >
            <i className="bi bi-arrow-clockwise me-1" /> Refresh
          </Button>
          <Button variant="primary" size="sm" className="rounded-3 p-2 px-3">
            Create New
          </Button>
          <div className="vr"></div>
          <div className="d-flex align-items-center gap-2">
            <Avatar />
          </div>
        </div>
      </Container>
    </Navbar>
  );
}
