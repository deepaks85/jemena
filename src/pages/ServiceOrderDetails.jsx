import { useEffect, useState } from "react";
import { Row, Col, Card, Table, Spinner } from "react-bootstrap";
import { Link, useParams, useLocation } from "react-router-dom";
import { getServiceOrderDetails } from "../services/dataservice";
import XMLViewerModal from "../components/XMLViewerModal";
import ErrorState from "../components/ErrorState";
import useGlobalRefresh from "../hooks/useGlobalRefresh";

export default function ServiceOrderDetails() {
  const { soId } = useParams();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showXml, setShowXml] = useState(false);
  const [lastSynced, setLastSynced] = useState(null);
  const [error, setError] = useState(null);

  const location = useLocation();

  // const from = location.state?.from || "/service-orders";

  const load = async () => {
    try {
      setLoading(true);

      const res = await getServiceOrderDetails(soId);
      setData(res);
      setLastSynced(new Date().toLocaleString());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [soId]);

  useGlobalRefresh(load);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner />
      </div>
    );
  }

  if (!data) {
    return <div className="text-center mt-5">No data found</div>;
  }

  function cleanXml(xml) {
    if (!xml || xml === "null") return "";

    try {
      return xml
        .replace(/\\r\\n/g, "")
        .replace(/\\"/g, '"')
        .replace(/\\\\/g, "\\")
        .trim();
    } catch {
      return xml;
    }
  }

  function downloadXml() {
    const xml = cleanXml(data.transactionReqXml);

    const blob = new Blob([xml], { type: "application/xml" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `SO_${soId}.xml`;
    a.click();

    window.URL.revokeObjectURL(url);
  }

  //   logic part based on different conditions

  const workType = data?.workType?.toLowerCase() || "";

  let primaryWork = "";
  let secondaryWork = "";

  if (workType.includes("metering")) {
    primaryWork = "Metering Service Works";
    secondaryWork = "Supply Service Works";
  } else {
    primaryWork = "Supply Service Works";
    secondaryWork = "Metering Service Works";
  }

  const soNumber = data?.CompanionSONumber;

  const companionText =
    data?.companionSoExists === "true" &&
    soNumber !== "null" &&
    soNumber !== "Pending"
      ? `SO# ${soNumber}`
      : "Pending";

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        {/* Left side: Breadcrumb */}
        <div className="d-flex align-items-center gap-2 small">
          <Link to="/" className="text-decoration-none">
            Dashboard
          </Link>

          <i className="bi bi-chevron-right small"></i>

          <Link to="/service-orders" className="text-decoration-none">
            Service Orders
          </Link>

          <i className="bi bi-chevron-right small"></i>

          <span className="text-muted">SO #{soId}</span>
        </div>

        {/* Right side: Last Synced */}
        <div className="text-muted small">Last synced: {lastSynced || "—"}</div>
      </div>

      <div className="d-flex align-items-center justify-content-between mb-3">
        <h2 className="mb-0">Dual Service Orders</h2>
      </div>

      {loading && (
        <div className="d-flex align-items-center justify-content-center my-5">
          <Spinner animation="border" size="sm" className="me-2" />
          <span>Loading service orders…</span>
        </div>
      )}

      {error && <ErrorState message={error} />}

      <Row className="align-items-center mb-4">
        {/* Primary Service Order */}
        <Col md={5}>
          <Card className="shadow-sm text-center rounded-4">
            <Card.Body>
              <div className="text-muted small">{primaryWork}</div>
              <div className="fw-semibold fs-5">
                <Link
                  to={`/service-orders/${data.soId}`}
                  className="text-decoration-none"
                >
                  SO# {data.soId}
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Arrow */}
        <Col md={2} className="text-center">
          <div className="fs-3 text-muted">⇄</div>
        </Col>

        {/* Companion Service Order */}
        <Col md={5}>
          <Card className="shadow-sm text-center rounded-4">
            <Card.Body>
              <div className="text-muted small">{secondaryWork}</div>

              <div className="fw-semibold fs-5">
                {companionText !== "Pending" ? (
                  <Link
                    to={`/service-orders/${data.CompanionSONumber}`}
                    className="text-decoration-none"
                  >
                    {companionText}
                  </Link>
                ) : (
                  companionText
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Metadata Table */}

      <Card className="mb-4 rounded-4">
        {/* <Card.Header className="fw-semibold">Metadata</Card.Header> */}

        <Card.Body className="rounded-4">
          <Table responsive className="mb-0">
            <tbody>
              <tr>
                <td className="fw-semibold" width="30%">
                  Status
                </td>
                <td>{data.status}</td>
              </tr>
              <tr>
                <td className="fw-semibold" width="30%">
                  NMI
                </td>
                <td>{data.nmi}</td>
              </tr>

              <tr>
                <td className="fw-semibold">Created Date</td>
                <td>{data.receivedAt}</td>
              </tr>

              <tr>
                <td className="fw-semibold">Process Type</td>
                <td>{data.processType}</td>
              </tr>

              <tr>
                <td className="fw-semibold">Work Type</td>
                <td>{data.workType}</td>
              </tr>
              <tr>
                <td className="fw-semibold">Transaction XML</td>
                <td>
                  {!data.transactionReqXml ||
                  data.transactionReqXml === "null" ? (
                    <span className="text-muted pe-2">View XML</span>
                  ) : (
                    <a
                      role="button"
                      className="text-decoration-none me-2"
                      onClick={() => setShowXml(true)}
                    >
                      View XML
                    </a>
                  )}{" "}
                  <span className="small">|</span>{" "}
                  {!data.transactionReqXml ||
                  data.transactionReqXml === "null" ? (
                    <span className="text-muted px-2">Download XML</span>
                  ) : (
                    <a
                      role="button"
                      className="text-decoration-none px-2"
                      onClick={() => downloadXml()}
                    >
                      Download XML
                    </a>
                  )}
                </td>
              </tr>
            </tbody>
          </Table>
        </Card.Body>
        <XMLViewerModal
          show={showXml}
          onHide={() => setShowXml(false)}
          xml={
            cleanXml(data.transactionReqXml) || "<empty>No XML Found</empty>"
          }
        />
      </Card>

      <Card className="mb-4 rounded-4">
        <Card.Body>
          <Card.Title className="pt-1 pb-2">Event Timeline</Card.Title>
          <Table hover responsive className="align-middle mb-0">
            <thead>
              <tr>
                <th>Event Name</th>
                <th>Type</th>
                <th>Status</th>
                <th>Started At</th>
                <th>Ended At</th>
                <th>Incident</th>
              </tr>
            </thead>

            <tbody>
              {data?.elements?.map((el, idx) => (
                <tr key={idx}>
                  <td>{el.elementName}</td>
                  <td>{el.type}</td>
                  <td>{el.state}</td>
                  <td>{el.startedAt}</td>
                  <td>{el.endedAt}</td>
                  <td>{el.hasIncident ? "Yes" : "No"}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </>
  );
}
