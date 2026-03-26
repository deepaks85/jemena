import React, { useEffect, useMemo, useState } from "react";
import { Spinner, Row, Col } from "react-bootstrap";
import StatCards from "../components/StatCards";
import RecentActivities from "../components/RecentActivities";
import MyTasks from "../components/MyTasks";
import ErrorState from "../components/ErrorState";
import useGlobalRefresh from "../hooks/useGlobalRefresh";
import { fetchDashboardData } from "../services/dataservice";

export default function Dashboard({ search = "", refreshTick = 0 }) {
  const [raw, setRaw] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    try {
      setLoading(true);
      const data = await fetchDashboardData();
      setRaw(data);
      setError(null);
    } catch (e) {
      setError(e?.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  useGlobalRefresh(load);

  const filteredActivities = useMemo(() => {
    if (!raw?.recentActivities) return [];
    const s = (search || "").toLowerCase();

    return s
      ? raw.recentActivities.filter(
          (r) =>
            String(r.soId).toLowerCase().includes(s) ||
            String(r.id).toLowerCase().includes(s) ||
            String(r.processType).toLowerCase().includes(s) ||
            String(r.eventType).toLowerCase().includes(s),
        )
      : raw.recentActivities;
  }, [raw, search]);

  const filteredTasks = useMemo(() => {
    if (!raw?.myTasks) return [];
    const s = (search || "").toLowerCase();

    return s
      ? raw.myTasks.filter(
          (r) =>
            String(r.taskId).toLowerCase().includes(s) ||
            String(r.taskName).toLowerCase().includes(s) ||
            String(r.status).toLowerCase().includes(s) ||
            String(r.processType).toLowerCase().includes(s) ||
            String(r.nmi).toLocaleLowerCase().includes(s),
        )
      : raw.myTasks;
  }, [raw, search]);

  return (
    <>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h2 className="mb-0">Dashboard</h2>
        <div className="d-flex align-items-center gap-2">
          <div className="text-muted small">Last synced</div>
          <div className="small fw-semibold">
            {raw?.lastSynced ? new Date(raw.lastSynced).toLocaleString() : "—"}
          </div>
        </div>
      </div>

      {loading && (
        <div className="d-flex align-items-center justify-content-center my-5">
          <Spinner animation="border" size="sm" className="me-2" />
          <span>Loading dashboard…</span>
        </div>
      )}

      {error && <ErrorState message={error} />}

      {!loading && !error && raw && (
        <>
          <StatCards
            kpis={raw.kpis}
            thresholds={raw.kpiThresholds}
            limit={4}
            xl={3}
          />

          {/* Recent Activities */}
          <Row className="g-3 mt-1">
            <Col xs={12}>
              <RecentActivities rows={filteredActivities} />
            </Col>
          </Row>

          {/* My Tasks */}
          <Row className="g-3 mt-3">
            <Col xs={12}>
              <MyTasks rows={filteredTasks} />
            </Col>
          </Row>
        </>
      )}
    </>
  );
}
