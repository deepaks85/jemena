import React, { useMemo, useState, useEffect } from "react";
import { Card, Table, Pagination } from "react-bootstrap";
import StatusBadge from "./StatusBadge";
import EmptyState from "./EmptyState";
import { Link } from "react-router-dom";

const PAGE_SIZE = 10;

export default function MyTasks({ rows = [] }) {
  const [sort, setSort] = useState({ key: "taskId", dir: "asc" });
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [rows]);

  const onSort = (key) => {
    setSort((prev) =>
      prev.key === key
        ? { key, dir: prev.dir === "asc" ? "desc" : "asc" }
        : { key, dir: "asc" },
    );
  };

  const sorted = useMemo(() => {
    const arr = [...rows];
    const { key, dir } = sort;

    arr.sort((a, b) => {
      const av = (a[key] ?? "").toString().toLowerCase();
      const bv = (b[key] ?? "").toString().toLowerCase();
      if (av < bv) return dir === "asc" ? -1 : 1;
      if (av > bv) return dir === "asc" ? 1 : -1;
      return 0;
    });

    return arr;
  }, [rows, sort]);

  const totalPages = Math.ceil(sorted.length / PAGE_SIZE);
  const startItem = (page - 1) * PAGE_SIZE + 1;
  const endItem = Math.min(page * PAGE_SIZE, sorted.length);

  const paginatedRows = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return sorted.slice(start, start + PAGE_SIZE);
  }, [sorted, page]);

  const SortIcon = ({ col }) =>
    sort.key === col ? (
      <i
        className={`bi ${sort.dir === "asc" ? "bi-arrow-up" : "bi-arrow-down"} ms-1`}
      />
    ) : (
      <i className="bi bi-arrow-down-up ms-1 text-muted" />
    );

  return (
    <Card className="rounded-4">
      <Card.Body className="p-3">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <Card.Title className="pt-1">My Tasks</Card.Title>
          <Link to="/tasks" className="small fw-semibold text-decoration-none">
            View all tasks <i className="bi bi-arrow-right ms-1"></i>
          </Link>
        </div>

        {sorted.length === 0 ? (
          <EmptyState
            title="No tasks"
            message="You're all caught up. New tasks will appear here."
          />
        ) : (
          <div className="table-responsive">
            <Table hover size="sm" className="align-middle mb-0 fixed-table">
              <thead>
                <tr>
                  <th role="button" onClick={() => onSort("taskId")}>
                    Task ID <SortIcon col="taskId" />
                  </th>
                  <th role="button" onClick={() => onSort("taskName")}>
                    Task Name <SortIcon col="taskName" />
                  </th>
                  <th role="button" onClick={() => onSort("status")}>
                    Task Status <SortIcon col="status" />
                  </th>
                  <th role="button" onClick={() => onSort("processType")}>
                    Process Type <SortIcon col="processType" />
                  </th>
                  <th role="button" onClick={() => onSort("nmi")}>
                    NMI <SortIcon col="nmi" />
                  </th>
                  <th role="button" onClick={() => onSort("createdDate")}>
                    Created on <SortIcon col="createdDate" />
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedRows.map((r, idx) => (
                  <tr key={idx}>
                    <td className="col-w-id">
                      <Link
                        to={`/tasks/${r.taskId}`}
                        className="text-decoration-none fw-semibold"
                      >
                        {r.taskId}
                      </Link>
                    </td>
                    <td className="cell-truncate col-w-name" title={r.taskName}>
                      {r.taskName}
                    </td>
                    <td>
                      <StatusBadge status={r.status} />
                    </td>
                    <td
                      className="cell-truncate col-w-type"
                      title={r.processType}
                    >
                      {r.processType}
                    </td>
                    <td className="cell-truncate col-w-type" title={r.nmi}>
                      {r.nmi}
                    </td>
                    <td
                      className="cell-truncate col-w-type"
                      title={r.createdDate}
                    >
                      {r.createdDate}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </Card.Body>
      {/* Pagination card footer */}
      <Card.Footer className="d-flex justify-content-between align-items-center">
        <div className="small text-muted">
          Showing{" "}
          <strong>
            {startItem}-{endItem}
          </strong>{" "}
          of <strong>{sorted.length}</strong> result(s)
        </div>
        <Pagination className="mb-0">
          <Pagination.Prev
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          />
          {/* <Pagination.Item active>{page}</Pagination.Item> */}
          {[...Array(totalPages)].map((_, i) => (
            <Pagination.Item
              key={i}
              active={i + 1 === page}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          />
        </Pagination>
      </Card.Footer>
    </Card>
  );
}
