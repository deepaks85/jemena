import React from "react";

export default function LastSynced({ iso }) {
  const dt = iso ? new Date(iso) : null;
  const formatted = dt ? dt.toLocaleString() : "—";
  return <span>{formatted}</span>;
}
