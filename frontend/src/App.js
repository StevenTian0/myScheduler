import React, { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import Note from "./note";
import Button from "@mui/material/Button";
import Calendar from "./Calendar";
import Signup from "./Signup";
function App() {
  //notes is a list of note components
  return (
    <div>
      <Signup />
      <Calendar />
    </div>
  );
}

export default App;
