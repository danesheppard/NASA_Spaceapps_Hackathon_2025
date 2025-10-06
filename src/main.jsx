import React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";

import "./index.css";
import App from "./App.jsx";
import DeckComponent from "./DeckComponent.jsx";

const root = document.getElementById("root");

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="deckcomponent" element={<DeckComponent />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
