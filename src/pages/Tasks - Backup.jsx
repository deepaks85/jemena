import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  Card,
  Col,
  Dropdown,
  Form,
  Pagination,
  Row,
  Spinner,
  Table,
} from "react-bootstrap";
import { getTasks } from "../services/dataService";
import StatCards from "../components/StatCards";
import StatusBadge from "../components/StatusBadge";
import ColumnToggle from "../components/ColumnToggle";
import FiltersOffcanvas from "../components/FiltersOffcanvas";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/EmptyState";
import { Link } from "react-router-dom";
import useGlobalRefresh from "../hooks/useGlobalRefresh";

export default function Tasks() {
  const [raw, setRaw] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({});
  const [showFilters, setShowFilters] = useState(false);

  const [sort, setSort] = useState({ key: "soId", dir: "asc" });
  const [columns, setColumns] = useState([
    { key: "dueBy", label: "Due By", visible: true, sortable: true },
    { key: "taskId", label: "Task Id", visible: true, sortable: true },
    { key: "taskType", label: "Task Type", visible: true, sortable: true },
    {
      key: "soNumber",
      label: "SO#",
      visible: true,
      sortable: true,
    },
    { key: "nmi", label: "NMI", visible: true, sortable: true },
    // {
    //   key: "nmiLocation",
    //   label: "NMI Location",
    //   visible: true,
    //   sortable: true,
    // },
    // { key: "slaStatus", label: "SLA status", visible: true, sortable: true },
    {
      key: "status",
      label: "Status",
      visible: true,
      sortable: true,
    },
    {
      key: "assignedTo",
      label: "Assigned To",
      visible: true,
      sortable: true,
    },
  ]);

  const [page, setPage] = useState(1);
  const pageSize = 10;

  const load = async () => {
    try {
      setLoading(true);
      const data = await getTasks();
      console.log("API DATA:", data);
      setRaw({
        ...data,
        lastSynced: new Date().toISOString(),
      });
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

  // Compute rows after search + filters
  const filtered = useMemo(() => {
    const rows = raw?.tasks || [];
    if (!raw?.tasks) return [];
    const s = (search || "").toLowerCase().trim();

    const safe = (v) => (v ?? "").toString().toLowerCase();

    const passSearch = (r) => {
      if (!s) return true;

      return (
        safe(r.taskId).includes(s) ||
        safe(r.nmi).includes(s) ||
        safe(r.nmiLocation).includes(s) ||
        safe(r.taskType).includes(s) ||
        safe(r.soNumber).includes(s) ||
        safe(r.status).includes(s) ||
        safe(r.assignedTo).includes(s)
      );
    };

    const passFilters = (row) => {
      if (filters.taskType?.length && !filters.taskType.includes(row.taskType))
        return false;

      if (
        filters.assignedTo?.length &&
        !filters.assignedTo.includes(row.assignedTo)
      )
        return false;

      if (
        filters.nmiLocation?.length &&
        !filters.nmiLocation.includes(row.nmiLocation)
      )
        return false;

      if (filters.status && row.status !== filters.status) return false;

      return true;
    };

    return rows.filter((r) => passSearch(r) && passFilters(r));
  }, [raw, search, filters]);

  // Sorting
  const sorted = useMemo(() => {
    const arr = [...filtered];
    const { key, dir } = sort;
    arr.sort((a, b) => {
      const av = (a[key] ?? "").toString().toLowerCase();
      const bv = (b[key] ?? "").toString().toLowerCase();
      if (av < bv) return dir === "asc" ? -1 : 1;
      if (av > bv) return dir === "asc" ? 1 : -1;
      return 0;
    });
    return arr;
  }, [filtered, sort]);

  // Pagination
  const total = sorted.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const pageSafe = Math.min(page, pageCount);
  const pageRows = sorted.slice((pageSafe - 1) * pageSize, pageSafe * pageSize);

  // Column toggling
  const visibleCols = columns.filter((c) => c.visible !== false);
  const toggleColumn = (key) => {
    setColumns((prev) =>
      prev.map((c) =>
        c.key === key ? { ...c, visible: !(c.visible !== false) } : c,
      ),
    );
  };

  // Sorting helpers
  const onSort = (key) => {
    setSort((prev) =>
      prev.key === key
        ? { key, dir: prev.dir === "asc" ? "desc" : "asc" }
        : { key, dir: "asc" },
    );
  };
  const SortIcon = ({ col }) =>
    sort.key === col ? (
      <i
        className={`bi ${sort.dir === "asc" ? "bi-arrow-up" : "bi-arrow-down"} ms-1`}
      />
    ) : (
      <i className="bi bi-arrow-down-up ms-1 text-muted" />
    );

  // Export CSV (current view)
  const exportCSV = () => {
    const cols = visibleCols.map((c) => c.label);
    const keys = visibleCols.map((c) => c.key);

    const escape = (val) => {
      if (val == null) return "";
      const s = String(val);
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };

    const lines = [
      cols.join(","),
      ...sorted.map((r) =>
        keys.map((k) => escape(k === "taskId" ? `#${r[k]}` : r[k])).join(","),
      ), // export full sorted view, not just current page
    ];
    const blob = new Blob([lines.join("\n")], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tasks_${new Date().toISOString().slice(0, 19)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const masterFilters = useMemo(() => {
    if (!raw?.tasks?.length) return {};

    const unique = (arr) => [...new Set(arr.filter(Boolean))].sort();

    return {
      taskType: unique(raw.tasks.map((r) => r.taskType)),
      assignedTo: unique(raw.tasks.map((r) => r.assignedTo)),
      // nmiLocation: unique(raw.tasks.map((r) => r.nmiLocation)),
      status: unique(raw.tasks.map((r) => r.status)),
    };
  }, [raw]);

  const taskKpis = raw?.stats
    ? [
        {
          id: "activeTasks",
          label: "Active Tasks",
          value: raw.stats.activeTasks,
          icon: "bi-list-task",
        },
        {
          id: "awaitingCompletion",
          label: "Awaiting Completion",
          value: raw.stats.awaitingCompletion,
          icon: "bi-hourglass-split",
        },
        {
          id: "escalated",
          label: "Escalated",
          value: raw.stats.escalated,
          icon: "bi-exclamation-triangle",
        },
        {
          id: "expiringSoon",
          label: "Expiring Soon",
          value: raw.stats.expiringSoon,
          icon: "bi-clock-history",
        },
      ]
    : [];

  return (
    <>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h2 className="mb-0">Tasks</h2>
        <div className="text-muted small">
          Last synced:{" "}
          {raw?.lastSynced ? new Date(raw.lastSynced).toLocaleString() : "—"}
        </div>
      </div>

      {loading && (
        <div className="d-flex align-items-center justify-content-center my-5">
          <Spinner animation="border" size="sm" className="me-2" />
          <span>Loading Tasks…</span>
        </div>
      )}

      {error && <ErrorState message={error} />}

      {!loading && !error && raw && (
        <>
          {taskKpis.length > 0 && (
            <StatCards kpis={taskKpis} limit={4} xl={3} />
          )}

          {/* Search + actions */}
          <Row className="g-2 align-items-center mb-2">
            <Col xs={12} md={6} lg={7}>
              <div className="search-box position-relative">
                <i className="bi bi-search search-icon"></i>

                <Form.Control
                  size="sm"
                  placeholder="Search service orders"
                  className="px-5 rounded-3"
                  value={search}
                  onChange={(e) => {
                    setPage(1);
                    setSearch(e.target.value);
                  }}
                />
              </div>
            </Col>
            <Col xs="auto">
              <Button
                className="rounded-3"
                variant="outline-secondary"
                size="sm"
                onClick={() => setShowFilters(true)}
              >
                <i className="bi bi-sliders me-1" /> Filters
              </Button>
            </Col>
            <Col xs="auto">
              <ColumnToggle columns={columns} onToggle={toggleColumn} />
            </Col>
            <Col xs="auto">
              <Dropdown align="end">
                <Dropdown.Toggle
                  className="rounded-3"
                  variant="outline-secondary"
                  size="sm"
                >
                  <i className="bi bi-download me-1" /> Exports
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={exportCSV}>
                    <i className="bi bi-filetype-csv me-2" />
                    Export CSV (current view)
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Col>
          </Row>

          {/* Table */}
          <Card className="rounded-4">
            <Card.Body className="p-2">
              {pageRows.length === 0 ? (
                <div className="p-3">
                  <EmptyState
                    title="No tasks details"
                    message="Adjust filters or clear search to see results."
                  />
                </div>
              ) : (
                <div className="table-responsive">
                  <Table hover className="align-middle mb-0 so-table">
                    <thead>
                      <tr>
                        {visibleCols.map((c) => (
                          <th
                            key={c.key}
                            role={c.sortable ? "button" : undefined}
                            onClick={
                              c.sortable ? () => onSort(c.key) : undefined
                            }
                          >
                            {c.label} {c.sortable && <SortIcon col={c.key} />}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {pageRows.map((r, idx) => (
                        <tr key={`${r.taskId}-${idx}`}>
                          {visibleCols.map((c) => {
                            const k = c.key;
                            let cell = r[k];
                            if (k === "taskId")
                              cell = (
                                <Link
                                  to={`/tasks/${r.taskId}`}
                                  className="text-decoration-none fw-semibold"
                                >
                                  {r.taskId}
                                </Link>
                              );
                            if (k === "status")
                              cell = <StatusBadge status={r.status} />;
                            {
                              /* if (k === "slaStatus")
                              cell = <SlaBadge value={r.slaStatus} />; */
                            }
                            return (
                              <td
                                key={k}
                                className={
                                  k === "status" ||
                                  k === "taskType" ||
                                  k === "nmiLocation"
                                    ? "cell-truncate"
                                    : ""
                                }
                              >
                                {cell}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </Card.Body>

            {/* Pagination */}
            <Card.Footer className="d-flex justify-content-between align-items-center">
              <div className="small text-muted">
                Showing <strong>{pageRows.length}</strong> of{" "}
                <strong>{total}</strong> result(s)
              </div>
              <Pagination className="mb-0">
                <Pagination.Prev
                  disabled={pageSafe <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                />
                {[...Array(pageCount)].map((_, i) => (
                  <Pagination.Item
                    key={i}
                    active={i + 1 === page}
                    onClick={() => setPage(i + 1)}
                  >
                    {i + 1}
                  </Pagination.Item>
                ))}
                <Pagination.Next
                  disabled={pageSafe >= pageCount}
                  onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
                />
              </Pagination>
            </Card.Footer>
          </Card>

          {/* Filters panel */}
          <FiltersOffcanvas
            show={showFilters}
            onClose={() => setShowFilters(false)}
            master={masterFilters}
            value={filters}
            onApply={(f) => {
              setPage(1);
              setFilters(f);
              setShowFilters(false);
            }}
            onClear={() => {
              setPage(1);
              setFilters({});
            }}
          />
        </>
      )}
    </>
  );
}
