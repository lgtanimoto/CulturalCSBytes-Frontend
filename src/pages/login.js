import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { fetchData } from './fetchData';
import './questions.css';

const Login = ({setAuth}) => {

  const navigate = useNavigate();

  const [username, setUsename] = useState("");
  const [password, setPassword] = useState("");
  const [feedback, setFeedback] = useState("");
  const [errorMsg, setErrorMsg] = useState('');

  const handleUsernameChange = (event) => {
    setUsename(event.target.value);
  }
  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  }

  const goHome = () => {
    navigate("/home")
  }

  //makes backend call to login, navigates to enrollments if successful, displays message if not
  const continueClick = async (event) => {
    event.preventDefault();
    
    const body = { username, password };
    const apiUrl = "/api/authentication/login";
    const res = await fetchData(apiUrl, {
      method: "POST",
      headers: {"Content-type": "application/json"},
      body: JSON.stringify(body)
    });

    if (!res.isOk) {
      setErrorMsg('network error');
      return;
    }

    const parseRes = res.data;

    if (parseRes.token) {
      localStorage.setItem("token", parseRes.token);
      setAuth(true);
    } else if(username === "") {
      setFeedback("Username is required"); 
    } else if(password === "") {
        setFeedback("Password is required"); 
    } else {
      setAuth(false);
      setFeedback("Username or password is incorrect");
    }
    
  }

  const cardCSS = {
    label: {
      margin: "28px 0px 16px"
    }
  }

  const usernameSection = () => {
    return (
      <>
        <div className="item">
          <label for="username" style={cardCSS.label}>Username:</label>
          <input id="username" type="text" name="username" value={username} onChange={handleUsernameChange}></input>
        </div>
      </>
    )
  }

  const passwordSection = () => {
    return (
      <>
        <div className="item">
          <label for="password" style={cardCSS.label}>Password:</label>
          <input id="password" type="password" name="password" value={password} onChange={handlePasswordChange}></input>
        </div>
      </>
    )
  }

  const buttonSection = () => {
    return (
      <>
        <div className='item'>
          <button onClick={goHome}>Cancel</button>
          <button onClick={continueClick}>Continue</button>
        </div>
      </>
    )
  }

  return(
    <div className='Center'>
      <h1>Login</h1>
      <div className="username">
          {usernameSection()}
          {passwordSection()}
      </div>
      {buttonSection()}
      <p id="feedback">{feedback}</p>
    </div>
  );
}

export default Login;