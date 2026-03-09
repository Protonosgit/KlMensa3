"use client";
import dynamic from "next/dynamic";

const loadingStyle = {
  gap: "8px",
  backgroundColor: "var(--main-text)",
  color: "var(--main-bg)",
  width: "56px",
  height: "40px",
  borderRadius: "6px",
};

const FilterModal = dynamic(() => import("../FilterModal"), { ssr: false, loading: () => (
    <div style={loadingStyle}></div>
) });

export default FilterModal;