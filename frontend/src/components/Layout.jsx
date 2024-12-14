import React, { useState, useEffect } from "react";
import Walkthrough from "./Walkthrough";

const Layout = ({ children }) => {
  const [showWalkthrough, setShowWalkthrough] = useState(false);

  useEffect(() => {
    // Check if walkthrough should be shown
    const isFirstLogin = localStorage.getItem("showWalkthrough") === "true";
    if (isFirstLogin) {
      setShowWalkthrough(true);
      localStorage.removeItem("showWalkthrough"); // Remove flag after showing walkthrough
    }
  }, []);

  return (
    <div>
      <Walkthrough startTour={showWalkthrough} />
      {children}
    </div>
  );
};

export default Layout;
