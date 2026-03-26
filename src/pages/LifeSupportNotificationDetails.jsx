import DetailsPage from "../components/DetailsPage";
import { getLifeSupportNotificationDetails } from "../services/dataservice";

export default function LifeSupportNotificationDetails() {
  return (
    <DetailsPage
      title="Life Support Notification Details"
      fetchFn={getLifeSupportNotificationDetails}
      idParam="id"
      timelineKey="elements" // if exists
      basePath="/life-support-notifications"
      baseLabel="Life Support Notifications"
      idLabelPrefix="LSN"
      fields={[
        { key: "nmi", label: "NMI" },
        { key: "retailer", label: "Retailer" },
        { key: "status", label: "Status" },
        { key: "reason", label: "Reason" },
        { key: "processType", label: "Process Type" },
        { key: "receivedAt", label: "Created At" },
      ]}
    />
  );
}
