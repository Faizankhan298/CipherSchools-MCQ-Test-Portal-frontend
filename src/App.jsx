import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";

import RefrshHandler from "./RefrshHandler";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Home from "./components/Home";
import QuizComponent from "./components/QuizComponent";
import ResultComponent from "./components/ResultComponent";

import { data } from "../src/data";
import "./App.css";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);

  return (
    <div className="App">
      <RefrshHandler setIsAuthenticated={setIsAuthenticated} />
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home />} />
        <Route
          path="/quiz"
          element={
            <QuizComponent
              data={data}
              selectedOptions={selectedOptions}
              setSelectedOptions={setSelectedOptions}
            />
          }
        />
        <Route
          path="/result"
          element={
            <ResultComponent
              data={data}
              selectedOptions={selectedOptions}
              setSelectedOptions={setSelectedOptions}
            />
          }
        />
      </Routes>
    </div>
  );
}

export default App;
