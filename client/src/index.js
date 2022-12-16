import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { UserAuthContextProvider } from "./context/UserAuthContextProvider";
import BuildCodeError from "./pages/BuildCodeError/BuildCodeError";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import App from "./App";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <UserAuthContextProvider>
    <BrowserRouter>
      {window.navigator.onLine ? (
        <App />
      ) : (
        <BuildCodeError
          text={"If you're seeing this message, you're offline!"}
        />
      )}
    </BrowserRouter>
  </UserAuthContextProvider>
);
