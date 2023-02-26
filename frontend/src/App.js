import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { useEffect, useState } from "react";
import "./App.css";
import TestNotes from "./pages/TestNotes";

function App() {
  //gets all the notes from the database and updates the notes hook on start
  useEffect(() => {
  }, []);

  //notes is a list of note components
  return (
    <BrowserRouter>
      <Routes>
        <Route>
          <Route path="/" element={<TestNotes />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
export default App;
