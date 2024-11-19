import React from "react";
import { Routes, Route } from "react-router-dom";
import RaceList from "./components/RaceList";
import RaceVisualization from "./components/RaceVisualization";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<RaceList season={2024} />} />
      <Route path="/visualization/:id" element={<RaceVisualization />} />
    </Routes>
  );
};

export default App;
