// components/Breadcrumbs.jsx
import { Breadcrumb } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function Breadcrumbs({ items = [] }) {
  return (
    <Breadcrumb className="mb-3">
      {items.map((item, index) => (
        <Breadcrumb.Item
          key={index}
          linkAs={item.link ? Link : "span"}
          linkProps={
            item.link
              ? { to: item.link, className: "text-decoration-none small" }
              : {}
          }
          active={!item.link}
        >
          {item.label}
        </Breadcrumb.Item>
      ))}
    </Breadcrumb>
  );
}
