import { useState, useMemo } from "react";
import { Table, Form, Button } from "react-bootstrap";

export default function DataTable({ columns, data, pageSize = 10 }) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [visibleCols, setVisibleCols] = useState(
    Object.fromEntries(columns.map((c) => [c.key, true])),
  );

  // search filter
  const filtered = useMemo(() => {
    return data.filter((row) =>
      Object.values(row).join(" ").toLowerCase().includes(search.toLowerCase()),
    );
  }, [data, search]);

  // pagination
  const start = (page - 1) * pageSize;
  const paged = filtered.slice(start, start + pageSize);
  const totalPages = Math.ceil(filtered.length / pageSize);

  // CSV Export
  function exportCSV() {
    const header = columns.map((c) => c.label).join(",");
    const rows = filtered.map((r) => columns.map((c) => r[c.key]).join(","));

    const csv = header + "\n" + rows.join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "export.csv";
    a.click();
  }

  return (
    <>
      {/* toolbar */}
      <div className="d-flex justify-content-between mb-3">
        <Form.Control
          placeholder="Search..."
          style={{ width: 250 }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Button variant="outline-secondary" onClick={exportCSV}>
          Export
        </Button>
      </div>

      {/* column toggle */}
      <div className="mb-3">
        {columns.map((c) => (
          <Form.Check
            inline
            key={c.key}
            label={c.label}
            checked={visibleCols[c.key]}
            onChange={() =>
              setVisibleCols({
                ...visibleCols,
                [c.key]: !visibleCols[c.key],
              })
            }
          />
        ))}
      </div>

      {/* table */}
      <Table bordered hover responsive>
        <thead>
          <tr>
            {columns.map(
              (c) => visibleCols[c.key] && <th key={c.key}>{c.label}</th>,
            )}
          </tr>
        </thead>

        <tbody>
          {paged.map((row, i) => (
            <tr key={i}>
              {columns.map(
                (c) =>
                  visibleCols[c.key] && (
                    <td key={c.key}>{c.render ? c.render(row) : row[c.key]}</td>
                  ),
              )}
            </tr>
          ))}
        </tbody>
      </Table>

      {/* pagination */}
      <div className="d-flex justify-content-end gap-2">
        <Button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          variant="outline-secondary"
        >
          Prev
        </Button>

        <span className="align-self-center">
          Page {page} / {totalPages}
        </span>

        <Button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          variant="outline-secondary"
        >
          Next
        </Button>
      </div>
    </>
  );
}
