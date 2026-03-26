import React, { useEffect, useState } from "react";
import { Card, Table, Spinner, Alert, Breadcrumb } from "react-bootstrap";
import { useParams, Link } from "react-router-dom";

export default function DetailsPage({
  title = "Details",
  fetchFn,
  idParam = "id",
  fields = [],
  timelineKey = null,
  // ✅ NEW
  basePath = "",
  baseLabel = "",
  idLabelPrefix = "ID",
}) {
  const { [idParam]: id } = useParams();

  const buildBreadcrumbs = () => [
    { label: "Dashboard", link: "/" },
    { label: baseLabel, link: basePath },
    { label: `${idLabelPrefix} #${id}` },
  ];

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchFn(id)
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  // helper for label formatting
  const formatLabel = (key) =>
    key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase());

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!data) return null;

  return (
    <>
      {/* ✅ Breadcrumbs */}
      <Breadcrumb className="mb-2">
        {buildBreadcrumbs().map((item, index) => (
          <Breadcrumb.Item
            key={index}
            linkAs={item.link ? Link : "span"}
            linkProps={
              item.link
                ? { to: item.link, className: "text-decoration-none" }
                : {}
            }
            active={!item.link}
          >
            {item.label}
          </Breadcrumb.Item>
        ))}
      </Breadcrumb>

      {/* ✅ DETAILS TABLE */}
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h2 className="mb-0">{title}</h2>
      </div>

      <Card className="mb-4 rounded-4">
        <Card.Body>
          {/* <Card.Title className="mb-3">{title}</Card.Title> */}

          <Table responsive className="mb-0">
            <tbody>
              {(fields.length
                ? fields
                : Object.keys(data).map((key) => ({ key }))
              ).map((field) => {
                const key = field.key;
                if (key === timelineKey) return null;

                return (
                  <tr key={key}>
                    <td className="fw-semibold" width="30%">
                      {field.label || formatLabel(key)}
                    </td>
                    <td>{data[key] ?? "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* ✅ TIMELINE / EVENTS TABLE */}
      {timelineKey && data[timelineKey] && (
        <Card className="mb-4 rounded-4">
          <Card.Body>
            <Card.Title className="pb-2">Event Timeline</Card.Title>

            <Table hover responsive className="align-middle mb-0">
              <thead>
                <tr>
                  {Object.keys(data[timelineKey][0] || {}).map((col) => (
                    <th key={col}>{formatLabel(col)}</th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {data[timelineKey].map((item, idx) => (
                  <tr key={idx}>
                    {Object.keys(item).map((col) => (
                      <td key={col}>
                        {typeof item[col] === "boolean"
                          ? item[col]
                            ? "Yes"
                            : "No"
                          : (item[col] ?? "—")}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}
    </>
  );
}
