import React from "react";
import { Modal, Button } from "react-bootstrap";
import XMLViewer from "react-xml-viewer";

export default function XMLViewerModal({ show, onHide, xml }) {
  //if (!xml) return null;
  const safeXml =
    xml && xml !== "null" ? xml : "<no-data>No XML Available</no-data>";

  const copyXml = () => {
    navigator.clipboard.writeText(xml);
  };

  return (
    <Modal show={show} onHide={onHide} size="xl" centered>
      <Modal.Header closeButton>
        <Modal.Title>Transaction XML</Modal.Title>
      </Modal.Header>

      <Modal.Body style={{ maxHeight: "70vh", overflow: "auto" }}>
        <XMLViewer
          xml={safeXml}
          collapsible
          theme={{
            attributeKeyColor: "#6f42c1",
            attributeValueColor: "#198754",
          }}
        />
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={copyXml}>
          Copy XML
        </Button>

        <Button variant="primary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
