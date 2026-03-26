import DetailsPage from "../components/DetailsPage";
import { fetchLifeSupportDetails } from "../services/dataservice";

export default function LifeSupportDetails() {
  return (
    <DetailsPage
      title="Life Support Request Details"
      fetchFn={fetchLifeSupportDetails}
      idParam="id"
      timelineKey="elements"
      basePath="/life-support"
      baseLabel="Life Support"
      idLabelPrefix="SO"
      fields={[
        { key: "nmiLocation", label: "NMI Location" },
        { key: "nmi", label: "NMI" },
        { key: "retailer", label: "Retailer" },
        { key: "reason", label: "Reason" },
        { key: "processType", label: "Process Type" },
        { key: "status", label: "Status" },
        { key: "receivedAt", label: "Created At" },
      ]}
    />
  );
}
