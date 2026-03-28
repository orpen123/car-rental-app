import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import App from "./App.jsx";
import "./index.css";


const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
  return null;
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ScrollToTop />
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);