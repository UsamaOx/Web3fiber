import { createRoot } from "react-dom/client";
import "./site.css";

const root = createRoot(document.getElementById("root"));
const isEnhancedPage = window.location.pathname.replace(/\/+$/, "") === "/enhanced";

(isEnhancedPage ? import("./enhanced.jsx") : import("./landing.jsx")).then(
  ({ default: Page }) => root.render(<Page />),
);
