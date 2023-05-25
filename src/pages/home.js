import React from 'react';
import { useNavigate } from "react-router-dom";
import './questions.css';

function Home() {

  const navigate = useNavigate();

  const login = () => {
    navigate("/login")
  }

  const createAccount = () => {
    navigate("/create-account")
  }

  const about = () => {
    navigate("/about")
  }

  // welcome greetings section --------------------------
  const welcomeGreetings = () => {
    return (
      <>
        <div id="welcome">
        <h1>Welcome to CulturalCSBytes!</h1>
        <h2>By All Together Computer Science Education (ATCSED)</h2>
      </div>
      </>
    )
  } // end of welcome greetings section 

  const homeButtons = () => {
    return (
      <>
        <button id="login" onClick={login} >Login</button>
        <button id="createAccount" onClick={createAccount} >Create Account</button>
        <button id="about" onClick={about} >About</button>
      </>
    )
  }

  return (
    <div className="Center">
      {welcomeGreetings()}
      {homeButtons()}
    </div>
  );
}

export default Home;
