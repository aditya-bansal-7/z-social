import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Login from "./Components/Login";
import Home from "./Container/Home";
import Landing from "./Container/Landing";
import "./App.css";
import { AnimatePresence } from "framer-motion";

const App = () => {
  const location = useLocation(); // Get the current location using React Router's useLocation

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="login" element={<Login />} />
        <Route path="/explore/*" element={<Home />} loader={Home} />
        <Route path="/*" element={<Landing />} />
      </Routes>
    </AnimatePresence>
  );
};

export default App;
