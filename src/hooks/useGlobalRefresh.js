import { useEffect } from "react";

export default function useGlobalRefresh(callback) {
  useEffect(() => {
    const handleRefresh = () => {
      callback();
    };

    window.addEventListener("appRefresh", handleRefresh);

    return () => {
      window.removeEventListener("appRefresh", handleRefresh);
    };
  }, [callback]);
}
