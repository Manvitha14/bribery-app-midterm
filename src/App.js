import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./components/HomePage";
import ComplaintForm from "./components/ComplaintForm";
import TargetCallbackHandler from "./TargetCallbackHandler";
import { checkAuthorization, logout } from "./authUtils";
import Resources from "./components/Resources";
import SeeAllCases from "./components/SeeAllCases";
import CaseDetails from "./components/CaseDetail";
import { OverlayProvider, useOverlay } from "./components/OverlayContext"; // Import the context

const AppRoutes = () => {
  const location = useLocation();
  const jwtToken = sessionStorage.getItem("jwt");

  useEffect(() => {
    // Skip applying the effect for the TargetCallbackHandler route
    if (location.pathname === "/") return;

    const tokenUpdateInterval = setInterval(() => {
      if (jwtToken) {
        sessionStorage.setItem("jwt", jwtToken); // Extend the token's storage time
      }
    }, 1000);

    const authCheckInterval = setInterval(() => {
      if (!checkAuthorization()) {
        console.warn("Token check failed - redirecting to login");
        logout();
      }
    }, 1000); // Every 10 seconds

    return () => {
      clearInterval(tokenUpdateInterval);
      clearInterval(authCheckInterval);
    };
  }, [location.pathname, jwtToken]);

  return (
    <Routes>
      <Route path="/" element={<TargetCallbackHandler />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/complaint-form" element={<ComplaintForm />} />
      <Route path="/resources" element={<Resources />} />
      <Route path="/see-all-cases" element={<SeeAllCases />} />
      <Route path="/case/:caseId" element={<CaseDetails />} />
    </Routes>
  );
};

const AppContent = () => {
  const { showOverlay } = useOverlay(); // Use overlay state from context

  return (
    <div className={`App ${showOverlay ? "disable-interaction" : ""}`}>
      {/* Header and Footer will react to the overlay */}
      <Header />
      <AppRoutes />
      <Footer />
    </div>
  );
};

function App() {
  return (
    <OverlayProvider>
      <Router>
        <AppContent />
      </Router>
    </OverlayProvider>
  );
}

export default App;
