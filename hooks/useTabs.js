import { useState } from "react";

export const useTabs = ({ defaultTab }) => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  return {
    activeTab,
    setActiveTab,
  };
};
