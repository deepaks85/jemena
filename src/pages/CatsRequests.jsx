import React, { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import DataTable from "../components/DataTable";
import ErrorState from "../components/ErrorState";
import StatCards from "../components/StatCards";
import { Link } from "react-router-dom";
import useGlobalRefresh from "../hooks/useGlobalRefresh";
import { fetchCatsRequests } from "../services/dataService";

export default function CatsRequests() {
  const [raw, setRaw] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    try {
      setLoading(true);
      const data = await fetchCatsRequests();
      console.log("CATS API RESPONSE:", data);

      setRaw({
        ...data,
        lastSynced: new Date().toISOString(),
      });

      setError(null);
    } catch (e) {
      setError(e?.message || "Failed to load CATS requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  useGlobalRefresh(load);

  // 👉 Optional stats (if API provides)
  const kpis = raw?.stats
    ? [
        {
          id: "activeChangeRequests",
          label: "Active Change Requests",
          value: raw.stats.activeChangeRequests,
          icon: "bi-list",
          variant: "primary",
        },
        {
          id: "awaitingTaskCompletion",
          label: "Awaiting Task Completion",
          value: raw.stats.awaitingTaskCompletion,
          icon: "bi-plus-circle",
          variant: "warning",
        },
        {
          id: "escalated",
          label: "Escalated",
          value: raw.stats.escalated,
          icon: "bi-plus-circle",
          variant: "danger",
        },
        {
          id: "expiringSoon",
          label: "Expiring Soon",
          value: raw.stats.expiringSoon,
          icon: "bi-plus-circle",
          variant: "danger",
        },
      ]
    : [];

  return (
    <>
      {/* Header */}
      <div className="mb-3">
        <div className="d-flex justify-content-between align-items-center">
          <h2 className="mb-0">CATS Change Requests</h2>

          <div className="text-end">
            <div className="text-muted small">
              Last synced:{" "}
              {raw?.lastSynced
                ? new Date(raw.lastSynced).toLocaleString()
                : "—"}
            </div>
          </div>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="d-flex justify-content-center my-5">
          <Spinner animation="border" size="sm" className="me-2" />
          <span>Loading...</span>
        </div>
      )}

      {error && <ErrorState message={error} />}

      {!loading && !error && raw && (
        <>
          {/* Stats */}
          {kpis.length > 0 && <StatCards kpis={kpis} limit={4} xl={3} />}

          {/* Table */}
          <DataTable
            title="CATS Requests"
            data={raw.changeRequests || []}
            rowKey="ccrId"
            exportFileName="cats_requests"
            columns={[
              {
                key: "ccrId",
                label: "CCR ID",
                width: "160px",
                sortable: true,
              },
              { key: "nmi", label: "NMI", width: "140px", sortable: true },
              {
                key: "status",
                label: "Status",
                width: "140px",
                sortable: true,
              },
              {
                key: "assignedTo",
                label: "Assigned To",
                width: "140px",
                sortable: true,
              },
              {
                key: "dateCreated",
                label: "Created",
                width: "180px",
                sortable: true,
              },
            ]}
            searchFields={["ccrId", "nmi", "assignedTo", "status"]}
            filterFields={["status", "assignedTo"]}
            renderCell={(key, row) => {
              if (key === "ccrId") {
                return (
                  <Link
                    to={`/cats-request/${row.ccrId}`}
                    className="fw-semibold text-decoration-none"
                  >
                    {row.ccrId}
                  </Link>
                );
              }

              if (key === "createdDate") {
                return new Date(row.createdDate).toLocaleString();
              }

              return row[key];
            }}
          />
        </>
      )}
    </>
  );
}
