import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.scss";
import App from "./App.jsx";

import "./config/i18n";
import FullPageSpinner from "./components/UI/FullPageSpinner/FullPageSpinner";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Suspense fallback={<FullPageSpinner />}>
      <App />
    </Suspense>
  </StrictMode>
);
