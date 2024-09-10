import React, { useState } from "react";
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from './Home.js';
import AskLead from './Components/AskLead.js';
import ApplicationStatus from './Components/ApplicationStatus.js';
import SignInForm from './SignIn.js';
import LeaderBoard from './Components/LeaderBoard.js';
import Verification from "./Verification.js";
import SignUpForm from './SignUp.js';
import NavBar from './Components/NavBar.js';
import Admin from "./Components/Admin.js";
import MainAdmin from "./Components/MainAdmin.js";

function App() {
  return(
    <BrowserRouter>
        <Routes>
          <Route path='/Home' element={<Home />}/>
          <Route path='/AskLead' element={<AskLead/>}/>
          <Route path='/LeaderBoard' element={<LeaderBoard/>}/>
          <Route path='/ApplicationStatus' element={<ApplicationStatus/>}/>
          <Route path='/SignIn' element={<SignInForm/>}/>
          <Route path='/SignUp' element={<SignUpForm/>}/>
          <Route path="/" element={<Verification />}/>
          <Route path="/Admin" element={<Admin/>}/>
          <Route path="/MainAdmin" element={<MainAdmin/>}/>
        </Routes>
      </BrowserRouter>
  );
}
export default App;