import React from "react";
import ReactDOM from "react-dom/client";

import "./index.css";
import store from "./redux/store.js";

import App from "./App.jsx";
import { Toaster } from "./components/ui/sonner.jsx";
import { Provider } from "react-redux";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
    <Toaster />
  </React.StrictMode>
);
