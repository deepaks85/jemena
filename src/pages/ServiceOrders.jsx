import React, { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import StatCards from "../components/StatCards";
import StatusBadge from "../components/StatusBadge";
import ErrorState from "../components/ErrorState";
import { Link } from "react-router-dom";
import useGlobalRefresh from "../hooks/useGlobalRefresh";
import DataTable from "../components/DataTable";
import { fetchServiceOrders } from "../services/dataservice";

export default function ServiceOrders() {
  const [raw, setRaw] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    try {
      setLoading(true);
      const data = await fetchServiceOrders();
      setRaw(data);
      setError(null);
    } catch (e) {
      setError(e?.message || "Failed to load service orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  useGlobalRefresh(load);

  return (
    <>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h2 className="mb-0">Service Orders</h2>
        <div className="text-muted small">
          Last synced:{" "}
          {raw?.lastSynced ? new Date(raw.lastSynced).toLocaleString() : "—"}
        </div>
      </div>

      {loading && (
        <div className="d-flex align-items-center justify-content-center my-5">
          <Spinner animation="border" size="sm" className="me-2" />
          <span>Loading service orders…</span>
        </div>
      )}

      {error && <ErrorState message={error} />}

      {!loading && !error && raw && (
        <>
          <StatCards
            kpis={raw.kpis}
            thresholds={raw.kpiThresholds}
            limit={6}
            xl={2}
          />

          <DataTable
            title="Service Orders"
            data={raw.serviceOrders || []}
            rowKey="soId"
            exportFileName="service_orders"
            columns={[
              { key: "soId", label: "SO#", visible: true, sortable: true },
              { key: "nmi", label: "NMI", visible: true, sortable: true },
              {
                key: "retailer",
                label: "Retailer",
                visible: true,
                sortable: true,
              },
              {
                key: "processType",
                label: "Process type",
                visible: true,
                sortable: true,
              },
              {
                key: "workType",
                label: "Work type",
                visible: true,
                sortable: true,
              },
              { key: "status", label: "Status", visible: true, sortable: true },
              {
                key: "timeRemaining",
                label: "Time remaining",
                visible: true,
                sortable: true,
              },
              {
                key: "openTasks",
                label: "Open task c/o",
                visible: true,
                sortable: true,
              },
            ]}
            searchFields={[
              "soId",
              "nmi",
              "retailer",
              "processType",
              "workType",
              "status",
            ]}
            filterFields={["retailer", "processType", "workType", "status"]}
            renderCell={(key, row) => {
              if (key === "soId") {
                return (
                  <Link
                    to={`/service-orders/${row.soId}`}
                    className="text-decoration-none fw-semibold"
                  >
                    {row.soId}
                  </Link>
                );
              }

              if (key === "status") {
                return <StatusBadge status={row.status} />;
              }

              return row[key];
            }}
          />
        </>
      )}
    </>
  );
}
