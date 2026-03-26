import React, { useEffect, useState } from "react";
import { Table, Card, Spinner, Row, Col } from "react-bootstrap";
import { useParams, Link } from "react-router-dom";
import ErrorState from "../components/ErrorState";
import { fetchCatsDetails } from "../services/dataservice";
import useGlobalRefresh from "../hooks/useGlobalRefresh";

export default function CatsDetails() {
  const { id } = useParams();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastSynced, setLastSynced] = useState(null);
  const [error, setError] = useState(null);

  const load = async () => {
    try {
      setLoading(true);
      const res = await fetchCatsDetails(id);
      setData(res);
      setLastSynced(new Date().toLocaleString());
      setError(null);
    } catch (e) {
      setError(e?.message || "Failed to load details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [id]);
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

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        {/* Left side: Breadcrumb */}
        <div className="d-flex align-items-center gap-2 small">
          <Link to="/" className="text-decoration-none">
            Dashboard
          </Link>

          <i className="bi bi-chevron-right small"></i>

          <Link to="/cats-request" className="text-decoration-none">
            CATS Change Request
          </Link>

          <i className="bi bi-chevron-right small"></i>

          <span className="text-muted">SO #{id}</span>
        </div>

        {/* Right side: Last Synced */}
        <div className="text-muted small">Last synced: {lastSynced || "—"}</div>
      </div>

      <div className="d-flex align-items-center justify-content-between mb-3">
        <h2 className="mb-0">CATS Change Request Details</h2>
      </div>

      {loading && (
        <div className="d-flex justify-content-center my-5">
          <Spinner animation="border" size="sm" className="me-2" />
          <span>Loading details...</span>
        </div>
      )}

      {error && <ErrorState message={error} />}

      {!loading && !error && data && (
        <>
          <Card className="mb-4 rounded-4">
            <Card.Body className="rounded-4">
              <Table responsive className="mb-0">
                <tbody>
                  <tr>
                    <td className="fw-semibold" width="30%">
                      CR#
                    </td>
                    <td>{data.crId}</td>
                  </tr>
                  <tr>
                    <td className="fw-semibold" width="30%">
                      NMI
                    </td>
                    <td>{data.nmi}</td>
                  </tr>
                  <tr>
                    <td className="fw-semibold" width="30%">
                      NMI Location
                    </td>
                    <td>{data.nmiLocation}</td>
                  </tr>

                  <tr>
                    <td className="fw-semibold">Process Type</td>
                    <td>{data.processType}</td>
                  </tr>

                  <tr>
                    <td className="fw-semibold">Status</td>
                    <td>{data.status}</td>
                  </tr>

                  <tr>
                    <td className="fw-semibold">Created At</td>
                    <td>{data.receivedAt}</td>
                  </tr>
                </tbody>
              </Table>
            </Card.Body>
          </Card>

          {/* Full Details */}
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
      )}
    </>
  );
}
