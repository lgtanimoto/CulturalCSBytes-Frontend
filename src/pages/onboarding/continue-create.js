import React, { useState } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import '../questions.css';

const ContinueCreateAccount = ({setAuth}) => { 
  
  const navigate = useNavigate();
  const location = useLocation();


  // creating a useState for each input 
  const [username, setUsename] = useState(location.state.name);
  const [password, setPassword] = useState(location.state.pw);
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState(14);
  const [zipcode, setZipcode] = useState("");
  const [feedback, setFeedback] = useState("");
  
  // updating user's username, password, nickname, email, ... after user inputs data
  const handleUsernameChange = (event) => {
    setUsename(event.target.value);
  }
  
  // eslint-disable-next-line 
  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  }
  const handleNicknameChange = (event) => {
    setNickname(event.target.value);
  }

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  }
  const handleAgeChange = (event) => {
    setAge(event.target.value);
  }
  const handleZipcodeChange = (event) => {
    setZipcode(event.target.value);
  }

  const goHome = () => {
    navigate("/home");
  }

  // handling continue button click event 
  const continueClick = async (event) => {
    event.preventDefault();

    const updatedNickname = nickname === "" ? username : nickname;

    if(email === "") {
      setFeedback("Email is required"); 
    } else if(zipcode === "") {
      setFeedback("Zipcode is required"); 
    } else {
        try {
          const body = {
            username, 
            password, 
            nickname: updatedNickname, 
            email, 
            age, 
            zipcode, 
            name: location.state.name, 
            pw: location.state.pw
          };
    
          const res = await fetch("/api/authentication/register", {
            method: "POST",
            headers: {"Content-type": "application/json"},
            body: JSON.stringify(body)
          });
    
          const parseRes = await res.json()
    
          if (res.ok) {
            localStorage.setItem("token", parseRes.token);
            setAuth(true);
            console.log(parseRes);
          } else {
            if (parseRes.error === "User already exists.") {
              setFeedback("Username already exists.");
            } 
          }
        } catch (err) {
          console.log(err.message);
        }
        
    }

      // need to get the id and initialize it 

  // when this section is uncommented, 
  // the navigation to enroll page throws an error probably b/c data isn't properly being transfereed from continue-create.js page to enroll.js page
    // still need to navigate to course-enrollment.js page instead of enroll.js page
      // navigate("/enroll", {
      //   state: {
      //     username, nickname: document.getElementById("nickname").value,
      //   },
      // });

  
  };

  // temporary will remove  
  const cardCSS = {
    label: {
      margin: "28px 0px 16px"
    }
  }

  const usernameSection = () => {
    return (
      <>
        <div className="item">
          <label style={cardCSS.label}>Username:</label>
          <input id="username" type="text" name="username" value={username} onChange={handleUsernameChange}></input>
        </div>
      </>
    )
  }

  const nicknameSection = () => {
    return (
      <>
        <div className="item">
          <label style={cardCSS.label}>Nickname:</label>
          <input id="nickname" type="text" name="nickname" value={nickname} onChange={handleNicknameChange}></input>
        </div>
      </>
    )
  }

  const emailSection = () => {
    return (
      <>
        <div className="item">
          <label style={cardCSS.label}>Email:</label>
          <input id="email" type="email" name="email" placeholder="sophie@example.com" value={email} onChange={handleEmailChange}></input>
        </div>
      </>
    )
  }

  const ageSection = () => {
    return (
      <>
        <div className="item">
          <label style={cardCSS.label}>Age:</label>
          <div className="dropdown">
            <select name="age" id="age" value={age} onChange={handleAgeChange}>
                <option value="less-than-8">Younger than 8</option>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10">10</option>
                <option value="11">11</option>
                <option value="12">12</option>
                <option value="13">13</option>
                <option value="14">14</option>
                <option value="15">15</option>
                <option value="16">16</option>
                <option value="17">17</option>
                <option value="18">18</option>
                <option value="19">19</option>
                <option value="20">20</option>
                <option value="21">21</option>
                <option value="older-than-21">Older than 21</option>
            </select>
          </div>
        </div>
      </>
    )
  }

  const zipcodeSection = () => {
    return (
      <>
        <div className="item">
          <label style={cardCSS.label}>Zip Code:</label>
          <input id="zipcode" type="text" pattern="[0-9]{5}" name="zipcode" placeholder="Five digit zip code" value={zipcode} onChange={handleZipcodeChange}></input>
        </div>
      </>
    )
  }

  const questionSetSection = () => {
    return (
      <>
        <div className="item">
          <label style={cardCSS.label}>Initial Question Set:</label>
          <input readOnly="readonly" value="Computer Science Principle Basics" variant="outlined" label="Disabled Dropdown"/>
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


  return (
    <form onSubmit={continueClick}>
      <div className='Center'>
        <h1>Create Account</h1>
        <div className="username">
          {usernameSection()}
          {nicknameSection()}
          {emailSection()}
          {ageSection()}
          {zipcodeSection()}
          {questionSetSection()}
        </div>
          {buttonSection()}
        <p id="feedback">{feedback}</p>
      </div>
    </form>
  ); 
};

export default ContinueCreateAccount;