import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import TopNav from "./components/TopNav";
import Dashboard from "./pages/Dashboard";
import Placeholder from "./pages/Placeholder";
import ServiceOrders from "./pages/ServiceOrders";
import ServiceOrderDetails from "./pages/ServiceOrderDetails";
import Tasks from "./pages/Tasks";
import TaskDetails from "./pages/TaskDetails";
import LifeSupport from "./pages/LifeSupport";
import LifeSupportDetails from "./pages/LifeSupportDetails";
import CatsRequests from "./pages/CatsRequests";
import CatsDetails from "./pages/CatsDetails";
import LifeSupportNotifications from "./pages/LifeSupportNotifications ";
import LifeSupportNotificationDetails from "./pages/LifeSupportNotificationDetails";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function App() {
  // 🔁 Shared state across pages
  const [search, setSearch] = useState(""); // <-- shared search
  const [network, setNetwork] = useState("All"); // optional: shared network filter

  // Optional: route-level refresh trigger (increment to notify Dashboard to reload)
  const [refreshTick, setRefreshTick] = useState(0);
  const handleRefresh = () => setRefreshTick((t) => t + 1);

  return (
    <div className="app-shell">
      <Sidebar />

      {/* Make TopNav a controlled component */}
      <TopNav
        search={search}
        onSearchChange={setSearch}
        network={network}
        onNetworkChange={setNetwork}
        onRefresh={handleRefresh}
      />

      <main className="main">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route
            path="/dashboard"
            element={
              <Dashboard
                search={search} // <-- pass down to filter tables
                network={network} // optional: if you want network-scoped filters
                refreshTick={refreshTick} // optional: reload on refresh
              />
            }
          />
          <Route
            path="/notifications"
            element={<Placeholder title="Notifications" />}
          />
          <Route path="/life-support" element={<LifeSupport />} />
          <Route path="/life-support/:id" element={<LifeSupportDetails />} />

          <Route path="/service-orders" element={<ServiceOrders />} />
          <Route
            path="/service-orders/:soId"
            element={<ServiceOrderDetails />}
          />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/tasks/:taskId" element={<TaskDetails />} />
          <Route
            path="/customer-site"
            element={<Placeholder title="Customer & site details" />}
          />
          <Route path="/cats-request" element={<CatsRequests />} />
          <Route path="/cats-request/:id" element={<CatsDetails />} />

          <Route
            path="/life-support-notifications"
            element={<LifeSupportNotifications />}
          />
          <Route
            path="/life-support-notifications/:id"
            element={<LifeSupportNotificationDetails />}
          />

          <Route path="/tasks" element={<Placeholder title="Tasks" />} />
          <Route
            path="/transactions"
            element={<Placeholder title="Transactions" />}
          />
          <Route
            path="/processes"
            element={<Placeholder title="Processes" />}
          />
          <Route path="/misc" element={<Placeholder title="Misc" />} />
          <Route path="*" element={<Placeholder title="Not found" />} />
        </Routes>
      </main>
    </div>
  );
}
