import { useEffect, useState } from "react";
import DataTable from "../components/DataTable";
import { Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import StatCards from "../components/StatCards";
import { getLifeSupportNotifications } from "../services/dataservice";
import useGlobalRefresh from "../hooks/useGlobalRefresh";

export default function LifeSupportNotifications() {
  const [raw, setRaw] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    try {
      setLoading(true);
      const data = await getLifeSupportNotifications();

      setRaw({
        ...data,
        lastSynced: new Date().toISOString(),
      });

      setError(null);
    } catch (e) {
      setError(e?.message || "Failed to load tasks");
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
          <h2 className="mb-0">Life Support Notifications</h2>

          <div className="text-end">
            <div className="text-muted small">
              Last synced:{" "}
              {raw?.lastSynced
                ? new Date(raw.lastSynced).toLocaleString()
                : "—"}
            </div>

            {/* ✅ Button under Last Synced
            <button
              className="btn btn-primary btn-md mt-2 rounded-3"
              onClick={() => setShowModal(true)}
            >
              + New Request
            </button> */}
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
            title="Life Support Notifications"
            data={raw.requests || []}
            rowKey="lsrNumber"
            exportFileName="life_support_notifications"
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
                label: "Created At",
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
                    to={`/life-support-notifications/${row.lsrNumber}`}
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
    </>
  );
}
