import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

// Import the consolidated context provider
import { DashboardProvider } from "./context/DashboardContext.jsx";

// Import Global Styles
import "./styles/global.css";
// NOTE: index.css is often used for root styling, but global.css handles it now.

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* Use the single, unified Dashboard Provider */}
    <DashboardProvider>
      <App />
    </DashboardProvider>
  </React.StrictMode>
);