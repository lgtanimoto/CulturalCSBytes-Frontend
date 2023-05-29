import React, { useState } from 'react';
import { useNavigate} from "react-router-dom";
import '../questions.css';

const CreateAccount = ({setAuth}) => {

  const navigate = useNavigate();

  const [username, setUsename] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [feedback, setFeedback] = useState("");

  const handleUsernameChange = (event) => {
    setUsename(event.target.value);
  }
  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  }
  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };

  const goHome = () => {
    navigate("/home");
  }

  //checks to make sure username is not blank, and is unique
  //checks to make sure the password is 8 characters or longer
  //checks to make sure passwords match

  const continueClick = async (event) => {
    event.preventDefault();
    if(username === "") {
      setFeedback("Username cannot be blank");
    } else if (password.length < 8) {
      setFeedback("Password must be 8 characters or longer");
    } else if (password !== confirmPassword) {
      setFeedback("Passwords do not match");
    } else {
      navigate("/continue-create-account", {state: {name: username, pw: password} })
    }

  };

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

    const confirmPasswordSection = () => {
      return (
        <>
          <div className="item">
            <label for="confirm-password" style={cardCSS.label}>Confirm Password:</label>
            <input id="confirm-password" type="password" value={confirmPassword} onChange={handleConfirmPasswordChange}></input>
          </div>
        </>
      )
    }

    const buttonSection = () => {
      return (
        <>
          <div className="item">
            <button onClick={goHome}>Cancel</button>
            <button onClick={continueClick}>Continue</button>
          </div>
        </>
      )
    }

  return(
    <form onSubmit={continueClick}>
      <div className="Center">
        <h1>Create Account</h1>
        <div className="username">
          {usernameSection()}
          {passwordSection()}
          {confirmPasswordSection()}
        </div>
          {buttonSection()}
          <p id="feedback">{feedback}</p>
      </div>
    </form>
  );
}

export default CreateAccount;