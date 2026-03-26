// export async function fetchDashboardData() {
//   const res = await fetch("/data/dashboard.json", {
//     headers: { "Cache-Control": "no-cache" },
//   });
//   if (!res.ok) throw new Error(`Failed to load dashboard data (${res.status})`);
//   return res.json();
// }

// ****** Local JSON *****//

// export async function fetchServiceOrders() {
//   const res = await fetch("/data/serviceOrders.json", {
//     headers: { "Cache-Control": "no-cache" },
//   });
//   if (!res.ok) throw new Error(`Failed to load service orders (${res.status})`);
//   return res.json();
// }

// ****** API JSON *****//

// All Service Orders

export async function fetchServiceOrders() {
  const res = await fetch(
    "https://slashingly-untransgressed-linwood.ngrok-free.dev/msi/v1/process/service-orders",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
      },
    },
  );

  if (!res.ok) {
    throw new Error(`Failed to load service orders (${res.status})`);
  }

  const data = await res.json();

  const rows = (data.orders || []).map((o) => ({
    soId: o.soId,
    nmi: o.nmi,
    retailer: o.retailer,
    processType: o.processType,
    workType: o.workType,
    status: o.status,
    timeRemaining: o.timeRemaining,
    openTasks: o.openTaskCount,
  }));

  const kpis = [
    {
      label: "Active Processes",
      value: data.stats.activeProcesses,
      variant: "primary",
      icon: "bi-gear",
    },
    {
      label: "Awaiting Companion SO",
      value: data.stats.awaitingCompanionSO,
      variant: "warning",
      icon: "bi-clock",
    },
    {
      label: "Awaiting Task Completion",
      value: data.stats.awaitingTaskCompletion,
      variant: "info",
      icon: "bi-list-task",
    },
    {
      label: "Escalated",
      value: data.stats.escalated,
      variant: "danger",
      icon: "bi-exclamation-triangle",
    },
    {
      label: "SLA Breached",
      value: data.stats.slaBreached,
      variant: "danger",
      icon: "bi-x-circle",
    },
    {
      label: "Expiring Soon",
      value: data.stats.expiringSoon,
      variant: "warning",
      icon: "bi-alarm",
    },
  ];

  return {
    kpis,
    serviceOrders: rows,
    totalCount: data.totalCount,
    lastSynced: new Date().toISOString(),
  };
}

// Service Order Details

export async function getServiceOrderDetails(soId) {
  const res = await fetch(
    `https://slashingly-untransgressed-linwood.ngrok-free.dev/msi/v1/process/service-order-details/${soId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
      },
    },
  );

  return res.json();
}

const API_URL =
  "https://slashingly-untransgressed-linwood.ngrok-free.dev/msi/v1/process/dashboard";

const LOCAL_JSON = "/data/dashboard_api.json";

export async function fetchDashboardData() {
  try {
    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
      },
    });

    if (!response.ok) {
      throw new Error("API failed");
    }

    const apiData = await response.json();
    console.log("API RESPONSE:", apiData);

    return transformApiData(apiData);
  } catch (error) {
    console.warn("API failed. Loading local JSON instead.");

    const localResponse = await fetch(LOCAL_JSON);
    const localData = await localResponse.json();

    console.log("LOCAL JSON RESPONSE:", localData);

    return localData;
  }
}

/* Convert API summary → KPI format expected by UI */
function transformApiData(apiData) {
  const kpis = [
    {
      id: "activeProcesses",
      label: "Active processes",
      value: apiData?.summary?.activeProcesses?.count || 0,
      delta: apiData?.summary?.activeProcesses?.footerText || "",
      icon: "bi-lightning-charge",
    },
    {
      id: "pendingSLA",
      label: "Pending SLA",
      value: apiData?.summary?.pendingSla?.count || 0,
      delta: apiData?.summary?.pendingSla?.footerText || "",
      icon: "bi-hourglass-split",
    },
    {
      id: "openTasks",
      label: "Open tasks",
      value: apiData?.summary?.openTasks?.count || 0,
      delta: apiData?.summary?.openTasks?.footerText || "",
      icon: "bi-list-check",
    },
    {
      id: "failedToday",
      label: "Failed today",
      value: apiData?.summary?.failedToday?.count || 0,
      delta: apiData?.summary?.failedToday?.footerText || "",
      icon: "bi-exclamation-octagon",
    },
  ];

  return {
    lastSynced: new Date().toISOString(),
    kpis,
    recentActivities: apiData.recentActivities || [],
    myTasks: apiData.myTasks || [],
  };
}

// All Tasks

export async function getTasks() {
  const res = await fetch(
    "https://slashingly-untransgressed-linwood.ngrok-free.dev/msi/v1/process/tasks",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
      },
    },
  );

  if (!res.ok) {
    throw new Error("Failed to fetch tasks");
  }

  return res.json();
}

// Task Details

export async function getTaskDetails(taskId) {
  const res = await fetch(
    `https://slashingly-untransgressed-linwood.ngrok-free.dev/msi/v1/process/tasks/${taskId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
      },
    },
  );

  if (!res.ok) {
    throw new Error("Failed to fetch task details");
  }

  return res.json();
}

// Life Support Request

export const fetchLifeSupportRequests = async () => {
  const res = await fetch(
    "https://slashingly-untransgressed-linwood.ngrok-free.dev/msi/v1/process/life-support-requests",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
      },
    },
  );
  return res.json();
};

// Life Support Request Details

export const fetchLifeSupportDetails = async (id) => {
  const res = await fetch(
    `https://slashingly-untransgressed-linwood.ngrok-free.dev/msi/v1/process/life-support-details/${id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
      },
    },
  );
  return res.json();
};

// CATS Change Request

export const fetchCatsRequests = async () => {
  const res = await fetch(
    "https://slashingly-untransgressed-linwood.ngrok-free.dev/msi/v1/process/cats",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
      },
    },
  );
  return res.json();
};

// CATS Change Request Details

export const fetchCatsDetails = async (id) => {
  const res = await fetch(
    `https://slashingly-untransgressed-linwood.ngrok-free.dev/msi/v1/process/cats-details/${id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
      },
    },
  );
  return res.json();
};

// Life Support Notification

export const getLifeSupportNotifications = async () => {
  const res = await fetch(
    "https://slashingly-untransgressed-linwood.ngrok-free.dev/msi/v1/process/life-support-notifications",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
      },
    },
  );
  return res.json();
};

// Life Support Notification Details

export const getLifeSupportNotificationDetails = async (id) => {
  const res = await fetch(
    `https://slashingly-untransgressed-linwood.ngrok-free.dev/msi/v1/process/life-support-notification-details/${id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
      },
    },
  );
  return res.json();
};
