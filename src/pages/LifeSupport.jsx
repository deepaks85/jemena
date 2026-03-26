import React, { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import DataTable from "../components/DataTable";
import ErrorState from "../components/ErrorState";
import StatCards from "../components/StatCards";
import { Link } from "react-router-dom";
import useGlobalRefresh from "../hooks/useGlobalRefresh";
import LifeSupportFormModal from "./LifeSupportFormModal";
import LifeSupportForm from "./LifeSupportForm";
import { fetchLifeSupportRequests } from "../services/dataservice";

export default function LifeSupportRequests() {
  const [raw, setRaw] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const data = await fetchLifeSupportRequests();

      setRaw({
        ...data,
        lastSynced: new Date().toISOString(),
      });

      setError(null);
    } catch (e) {
      setError(e?.message || "Failed to load life support requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  useGlobalRefresh(load);

  // ✅ KPI FIX
  const kpis = raw?.stats
    ? [
        {
          id: "totalRequests",
          label: "Total Requests",
          value: raw.stats.totalRequests,
          icon: "bi-list",
          variant: "primary",
        },
        {
          id: "newRequests",
          label: "New Requests",
          value: raw.stats.newRequests,
          icon: "bi-plus-circle",
          variant: "info",
        },
        {
          id: "monthlyTrend",
          label: "Monthly Trend",
          value: raw.stats.monthlyTrend,
          icon: "bi-graph-up",
          variant: raw.stats.monthlyTrend.includes("+") ? "success" : "danger",
        },
      ]
    : [];

  return (
    <>
      <div className="mb-3">
        {/* Row 1 */}
        <div className="d-flex justify-content-between align-items-center">
          <h2 className="mb-0">Life Support Requests</h2>

          <div className="text-end">
            <div className="text-muted small">
              Last synced:{" "}
              {raw?.lastSynced
                ? new Date(raw.lastSynced).toLocaleString()
                : "—"}
            </div>

            {/* ✅ Button under Last Synced */}
            <button
              className="btn btn-primary btn-md mt-2 rounded-3"
              onClick={() => setShowModal(true)}
            >
              + New Request
            </button>
          </div>
        </div>
      </div>

      {loading && (
        <div className="d-flex justify-content-center my-5">
          <Spinner animation="border" size="sm" className="me-2" />
          <span>Loading...</span>
        </div>
      )}

      {error && <ErrorState message={error} />}

      {!loading && !error && raw && (
        <>
          {/* ✅ STATS ADDED */}
          {kpis.length > 0 && <StatCards kpis={kpis} limit={3} xl={4} />}

          <DataTable
            title="Life Support Requests"
            data={raw.requests || []}
            rowKey="lsrNumber"
            exportFileName="life_support_requests"
            columns={[
              {
                key: "isNew",
                label: "",
                width: "60px",
                visible: true,
              },

              {
                key: "lsrNumber",
                label: "LSR#",
                width: "160px",
                sortable: true,
              },
              { key: "nmi", label: "NMI", width: "140px", sortable: true },
              {
                key: "retailer",
                label: "Retailer",
                width: "140px",
                sortable: true,
              },
              {
                key: "reason",
                label: "Reason",
                width: "200px",
                sortable: true,
              },
              {
                key: "receivedDate",
                label: "Received",
                width: "180px",
                sortable: true,
              },
            ]}
            searchFields={["lsrNumber", "nmi", "retailer", "reason"]}
            filterFields={["retailer", "reason"]}
            renderCell={(key, row) => {
              if (key === "isNew") {
                return row.isNew === true || row.isNew === "true" ? (
                  <span className="badge rounded-pill bg-primary px-3 py-2">
                    New
                  </span>
                ) : null;
              }

              if (key === "lsrNumber") {
                return (
                  <Link
                    to={`/life-support/${row.lsrNumber}`}
                    className="fw-semibold text-decoration-none"
                  >
                    {row.lsrNumber}
                  </Link>
                );
              }

              if (key === "receivedDate") {
                return new Date(row.receivedDate).toLocaleString();
              }

              return row[key];
            }}
          />
        </>
      )}
      <LifeSupportFormModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={load} // refresh table after submit
      >
        {({ handleSuccess, handleError }) => (
          <LifeSupportForm onSuccess={handleSuccess} onError={handleError} />
        )}
      </LifeSupportFormModal>
    </>
  );
}
