// import React, { useMemo, useState, useEffect } from "react";
// import { Card, Table, Pagination } from "react-bootstrap";
// import EmptyState from "./EmptyState";
// import { Link } from "react-router-dom";

// const PAGE_SIZE = 10;

// export default function RecentActivities({ rows = [] }) {
//   const [sort, setSort] = useState({ key: "soId", dir: "asc" });
//   const [page, setPage] = useState(1);

//   useEffect(() => {
//     setPage(1);
//   }, [rows]);

//   const onSort = (key) => {
//     setSort((prev) =>
//       prev.key === key
//         ? { key, dir: prev.dir === "asc" ? "desc" : "asc" }
//         : { key, dir: "asc" },
//     );
//   };

//   const sorted = useMemo(() => {
//     const arr = [...rows];
//     const { key, dir } = sort;
//     arr.sort((a, b) => {
//       const av = (a[key] ?? "").toString().toLowerCase();
//       const bv = (b[key] ?? "").toString().toLowerCase();
//       if (av < bv) return dir === "asc" ? -1 : 1;
//       if (av > bv) return dir === "asc" ? 1 : -1;
//       return 0;
//     });
//     return arr;
//   }, [rows, sort]);

//   const totalPages = Math.ceil(sorted.length / PAGE_SIZE);
//   const startItem = (page - 1) * PAGE_SIZE + 1;
//   const endItem = Math.min(page * PAGE_SIZE, sorted.length);

//   const paginatedRows = useMemo(() => {
//     const start = (page - 1) * PAGE_SIZE;
//     return sorted.slice(start, start + PAGE_SIZE);
//   }, [sorted, page]);

//   const SortIcon = ({ col }) =>
//     sort.key === col ? (
//       <i
//         className={`bi ${sort.dir === "asc" ? "bi-arrow-up" : "bi-arrow-down"} ms-1`}
//       />
//     ) : (
//       <i className="bi bi-arrow-down-up ms-1 text-muted" />
//     );

//   return (
//     <Card className="rounded-4">
//       <Card.Body className="p-3">
//         <div className="d-flex justify-content-between align-items-center mb-2">
//           <Card.Title className="pt-1">Recent Activities</Card.Title>
//         </div>

//         {sorted.length === 0 ? (
//           <EmptyState
//             title="No recent activity"
//             message="When transactions arrive, they will appear here."
//           />
//         ) : (
//           <div className="table-responsive">
//             <Table hover size="sm" className="align-middle mb-0 fixed-table">
//               <thead>
//                 <tr>
//                   <th role="button" onClick={() => onSort("soId")}>
//                     SO# <SortIcon col="soId" />
//                   </th>
//                   <th role="button" onClick={() => onSort("processType")}>
//                     Process type <SortIcon col="processType" />
//                   </th>
//                   <th role="button" onClick={() => onSort("eventType")}>
//                     Event type <SortIcon col="eventType" />
//                   </th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {paginatedRows.map((r, idx) => (
//                   <tr key={idx}>
//                     <td className="col-w-id">
//                       <Link
//                         to={`/service-orders/${r.soId}`}
//                         className="text-decoration-none fw-semibold"
//                       >
//                         {r.soId}
//                       </Link>
//                     </td>
//                     <td
//                       className="cell-truncate col-w-type"
//                       title={r.processType}
//                     >
//                       {r.processType}
//                     </td>
//                     <td
//                       className="cell-truncate col-w-name"
//                       title={r.eventType}
//                     >
//                       {r.eventType}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </Table>

//             {/* <div className="d-flex justify-content-end pt-3">
//               <Pagination size="sm">
//                 <Pagination.Prev
//                   disabled={page === 1}
//                   onClick={() => setPage((p) => p - 1)}
//                 />

//                 {[...Array(totalPages)].map((_, i) => (
//                   <Pagination.Item
//                     key={i}
//                     active={i + 1 === page}
//                     onClick={() => setPage(i + 1)}
//                   >
//                     {i + 1}
//                   </Pagination.Item>
//                 ))}

//                 <Pagination.Next
//                   disabled={page === totalPages}
//                   onClick={() => setPage((p) => p + 1)}
//                 />
//               </Pagination>
//             </div> */}
//           </div>
//         )}
//       </Card.Body>
//       {/* Pagination card footer */}
//       <Card.Footer className="d-flex justify-content-between align-items-center">
//         <div className="small text-muted">
//           Showing{" "}
//           <strong>
//             {startItem}-{endItem}
//           </strong>{" "}
//           of <strong>{sorted.length}</strong> result(s)
//         </div>
//         <Pagination className="mb-0">
//           <Pagination.Prev
//             disabled={page === 1}
//             onClick={() => setPage((p) => Math.max(1, p - 1))}
//           />
//           {/* <Pagination.Item active>{page}</Pagination.Item> */}
//           {[...Array(totalPages)].map((_, i) => (
//             <Pagination.Item
//               key={i}
//               active={i + 1 === page}
//               onClick={() => setPage(i + 1)}
//             >
//               {i + 1}
//             </Pagination.Item>
//           ))}
//           <Pagination.Next
//             disabled={page >= totalPages}
//             onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
//           />
//         </Pagination>
//       </Card.Footer>
//     </Card>
//   );
// }

import React, { useMemo, useState, useEffect } from "react";
import { Card, Table, Pagination } from "react-bootstrap";
import EmptyState from "./EmptyState";
import { Link } from "react-router-dom";

const PAGE_SIZE = 10;

export default function RecentActivities({ rows = [] }) {
  const [sort, setSort] = useState({ key: "id", dir: "asc" });
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

  // Logic for opening respective pages based on the selected ID on dashboard

  // const processRouteMap = {
  //   "Dual SO Fulfilment": (id) => `/service-orders/${id}`,
  //   "LSR Simplified (POC)": (id) => `/life-support/${id}`,
  //   "CATS Notification Processing": (id) => `/cats/${id}`,
  // };

  const getDetailsRoute = (processType, id) => {
    if (!processType || !id) return null;

    const name = processType.toLowerCase();

    if (name.includes("dual so")) {
      return `/service-orders/${id}`;
    }

    if (name.includes("life support requests")) {
      return `/life-support/${id}`;
    }

    if (name.includes("cats")) {
      return `/cats-request/${id}`;
    }

    if (name.includes("life support notification process")) {
      return `/life-support-notifications/${id}`;
    }

    return null;
  };

  const renderId = (r) => {
    //console.log("process name", r.processType); // ✅ inside function
    if (!r.id || r.id === "NULL" || r.id === "null") {
      return <span className="text-muted">{r.id}</span>;
    }

    const route = getDetailsRoute(r.processType, r.id);

    if (!route) {
      return <span className="fw-semibold">{r.id}</span>;
    }

    return (
      <Link to={route} className="text-decoration-none fw-semibold">
        {r.id}
      </Link>
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
          <Card.Title className="pt-1">Recent Activities</Card.Title>
        </div>

        {sorted.length === 0 ? (
          <EmptyState
            title="No recent activity"
            message="When transactions arrive, they will appear here."
          />
        ) : (
          <div className="table-responsive">
            <Table hover size="sm" className="align-middle mb-0 fixed-table">
              <thead>
                <tr>
                  <th role="button" onClick={() => onSort("id")}>
                    ID# <SortIcon col="id" />
                  </th>
                  <th role="button" onClick={() => onSort("processType")}>
                    Process type <SortIcon col="processType" />
                  </th>
                  <th role="button" onClick={() => onSort("eventType")}>
                    Event type <SortIcon col="eventType" />
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedRows.map((r, idx) => (
                  <tr key={idx}>
                    <td className="col-w-id">{renderId(r)}</td>
                    <td
                      className="cell-truncate col-w-type"
                      title={r.processType}
                    >
                      {r.processType}
                    </td>
                    <td
                      className="cell-truncate col-w-name"
                      title={r.eventType}
                    >
                      {r.eventType}
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
