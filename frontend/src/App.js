import React, { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import Note from "./note";
import Button from "@mui/material/Button";
import Calendar from "./Calendar";
import Signup from "./Signup";
import EditProfileForm from "./EditProfileForm";
import Login from "./Login";
import DeleteAccount from "./DeleteAccount";
function App() {
  //notes is a list of note components
  return (
    <div>
      <EditProfileForm />
      <Login />
      <Signup />
      <Calendar />
    </div>
  );
}

export default App;
