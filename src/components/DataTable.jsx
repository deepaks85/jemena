import React, { useMemo, useState } from "react";
import {
  Button,
  Card,
  InputGroup,
  Col,
  Dropdown,
  Form,
  Pagination,
  Row,
  Table,
} from "react-bootstrap";
import ColumnToggle from "./ColumnToggle";
import FiltersOffcanvas from "./FiltersOffcanvas";
import EmptyState from "./EmptyState";

export default function DataTable({
  title,
  data = [],
  columns: initialColumns = [],
  searchFields = [],
  filterFields = [],
  rowKey,
  renderCell,
  exportFileName = "data",
}) {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  const [columns, setColumns] = useState(initialColumns);
  const [sort, setSort] = useState({});
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const resolveData = (input) => {
    if (!input) return [];

    // already array
    if (Array.isArray(input)) return input;

    // common API patterns
    if (Array.isArray(input.requests)) return input.requests;
    if (Array.isArray(input.data)) return input.data;
    if (Array.isArray(input.results)) return input.results;
    if (Array.isArray(input.items)) return input.items;

    // fallback (try values)
    const values = Object.values(input);
    const firstArray = values.find((v) => Array.isArray(v));

    return firstArray || [];
  };

  const safeData = resolveData(data);

  // FILTER OPTIONS (auto generate)
  const masterFilters = useMemo(() => {
    const unique = (arr) => [...new Set(arr.filter(Boolean))].sort();

    const result = {};
    filterFields.forEach((field) => {
      result[field] = unique(safeData.map((r) => r[field]));
    });

    return result;
  }, [safeData, filterFields]);

  // SEARCH + FILTER
  const filtered = useMemo(() => {
    const s = search.toLowerCase();

    return safeData.filter((row) => {
      const matchSearch =
        !s ||
        searchFields.some((f) =>
          (row[f] || "").toString().toLowerCase().includes(s),
        );

      const matchFilter = Object.keys(filters).every((key) => {
        if (!filters[key]?.length) return true;
        return filters[key].includes(row[key]);
      });

      return matchSearch && matchFilter;
    });
  }, [data, search, filters, searchFields]);

  // SORT
  const sorted = useMemo(() => {
    if (!sort.key) return filtered;

    return [...filtered].sort((a, b) => {
      const av = (a[sort.key] || "").toString().toLowerCase();
      const bv = (b[sort.key] || "").toString().toLowerCase();

      if (av < bv) return sort.dir === "asc" ? -1 : 1;
      if (av > bv) return sort.dir === "asc" ? 1 : -1;
      return 0;
    });
  }, [filtered, sort]);

  // PAGINATION
  const pageCount = Math.ceil(sorted.length / pageSize);
  const pageRows = sorted.slice((page - 1) * pageSize, page * pageSize);

  // COLUMN TOGGLE
  const visibleCols = columns.filter((c) => c.visible !== false);
  const toggleColumn = (key) => {
    setColumns((prev) =>
      prev.map((c) =>
        c.key === key ? { ...c, visible: !(c.visible !== false) } : c,
      ),
    );
  };

  // SORT HANDLER
  const onSort = (key) => {
    setSort((prev) =>
      prev.key === key
        ? { key, dir: prev.dir === "asc" ? "desc" : "asc" }
        : { key, dir: "asc" },
    );
  };

  // CSV EXPORT
  const exportCSV = () => {
    const cols = visibleCols.map((c) => c.label);
    const keys = visibleCols.map((c) => c.key);

    const rows = sorted.map((r) => keys.map((k) => r[k] ?? "").join(","));

    const blob = new Blob([[cols.join(","), ...rows].join("\n")], {
      type: "text/csv",
    });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${exportFileName}.csv`;
    link.click();
  };

  const SortIcon = ({ colKey }) => {
    if (sort.key !== colKey) {
      return <i className="bi bi-arrow-down-up ms-1 text-muted" />;
    }

    return (
      <i
        className={`bi ${
          sort.dir === "asc" ? "bi-arrow-up" : "bi-arrow-down"
        } ms-1`}
      />
    );
  };

  return (
    <>
      {/* SEARCH + ACTIONS */}
      <Row className="g-2 align-items-center mb-2">
        <Col xs={12} md={6} lg={7}>
          {/* <InputGroup size="sm" className="rounded-4">
            <InputGroup.Text className="bg-white border-end-0 border-1">
              <i className="bi bi-search"></i>
            </InputGroup.Text>

            <Form.Control
              className="border-start-0 border-1"
              placeholder={`Search ${title}`}
              value={search}
              onChange={(e) => {
                setPage(1);
                setSearch(e.target.value);
              }}
            />
          </InputGroup> */}
          <div style={{ position: "relative" }}>
            <i
              className="bi bi-search"
              style={{
                position: "absolute",
                top: "50%",
                left: "10px",
                transform: "translateY(-50%)",
                color: "#222",
                fontSize: "12px",
              }}
            />

            <Form.Control
              type="text"
              placeholder={`Search ${title}`}
              value={search}
              onChange={(e) => {
                setPage(1);
                setSearch(e.target.value);
              }}
              style={{
                height: "27px",
                borderRadius: "8px",
                paddingLeft: "30px",
                border: "1px solid #888",
                fontSize: "12px",
              }}
            />
          </div>
        </Col>

        <Col xs="auto">
          <Button
            size="sm"
            className="rounded-3"
            variant="outline-secondary"
            onClick={() => setShowFilters(true)}
          >
            Filters
          </Button>
        </Col>

        <Col xs="auto">
          <ColumnToggle columns={columns} onToggle={toggleColumn} />
        </Col>

        <Col xs="auto">
          <Dropdown align="end">
            <Dropdown.Toggle
              size="sm"
              variant="outline-secondary"
              className="rounded-3"
            >
              Export
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={exportCSV}>Export CSV</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Col>
      </Row>

      {/* TABLE */}
      <Card className="rounded-4">
        <Card.Body className="p-2">
          {pageRows.length === 0 ? (
            <EmptyState
              title={`No ${title}`}
              message="Adjust filters or search"
            />
          ) : (
            <Table hover>
              <thead>
                <tr>
                  {visibleCols.map((c) => (
                    <th
                      key={c.key}
                      onClick={() => c.sortable && onSort(c.key)}
                      style={{
                        cursor: c.sortable ? "pointer" : "default",
                        width: c.width || "auto",
                        textAlign: c.key === "isNew" ? "center" : "left",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {c.label}
                      {c.sortable && <SortIcon colKey={c.key} />}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {pageRows.map((row, idx) => (
                  <tr key={row[rowKey] || idx}>
                    {visibleCols.map((c) => (
                      <td
                        key={c.key}
                        style={{
                          width: c.width || "auto",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {renderCell ? renderCell(c.key, row) : row[c.key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>

        {/* PAGINATION */}
        <Card.Footer className="d-flex justify-content-between">
          <div>
            Showing {pageRows.length} of {sorted.length}
          </div>

          <Pagination>
            {[...Array(pageCount)].map((_, i) => (
              <Pagination.Item
                key={i}
                active={i + 1 === page}
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </Pagination.Item>
            ))}
          </Pagination>
        </Card.Footer>
      </Card>

      {/* FILTER PANEL */}
      <FiltersOffcanvas
        show={showFilters}
        onClose={() => setShowFilters(false)}
        master={masterFilters}
        value={filters}
        onApply={(f) => {
          setFilters(f);
          setPage(1);
          setShowFilters(false);
        }}
        onClear={() => {
          setFilters({});
          setPage(1);
        }}
      />
    </>
  );
}
