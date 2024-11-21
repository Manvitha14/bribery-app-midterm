import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./components/HomePage";
import ComplaintForm from "./components/ComplaintForm";
import Resources from "./components/Resources";
import SeeAllCases from "./components/SeeAllCases";
import CaseDetails from "./components/CaseDetail";
import { OverlayProvider, useOverlay } from "./components/OverlayContext"; // Import the context

const AppContent = () => {
  const { showOverlay } = useOverlay(); // Use overlay state from context

  return (
    <div className={`App ${showOverlay ? "disable-interaction" : ""}`}>
      {/* Header and Footer will react to the overlay */}
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/complaint-form" element={<ComplaintForm />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/see-all-cases" element={<SeeAllCases />} />
        <Route path="/case/:caseId" element={<CaseDetails />} />
      </Routes>
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
