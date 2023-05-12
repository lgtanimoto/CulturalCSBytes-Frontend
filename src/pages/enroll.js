import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import './questions.css';

// add fetchImproved as util.js class 

const Enroll = ({setAuth}) => {

  const navigate = useNavigate();
  const location = useLocation();
  const [loaded, setLoaded] = useState(false);

  const id = location.state.id;
  const name = location.state.name;
  const practice = location.state.practice;
  const [sessionId, setSessionId] = useState(0);
  const [sessionName, setSessionName] = useState('');
  const [difficultyOptions, setDifficultyOptions] = useState([]);
  const [cultureOptions, setCultureOptions] = useState([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState('Medium');
  const [selectedCulture, setSelectedCulture] = useState('Default Culture');
  const [additionalCultures, setAdditionalCultures] = useState([]);

  useEffect(() => {
    async function fetchSessionData() {

      // make an id check
      if (!id) { 
        console.error("id")
      }

      try {
        const res = await fetch(`api/enrollments/${id}/sessions/new${practice ? '?practice=true' : ''}`, {
          method: 'GET',
          headers: {token: localStorage.token}
        });

        console.log(res)
        const parseData = await res.json();
        console.log(parseData);
        console.log(parseData.cultures);
        
        setLoaded(true);
        setSessionId(parseData.sessionId);
        setSessionName(parseData.sessionName);
        setDifficultyOptions(parseData.difficulties);
        setCultureOptions(parseData.cultures);

        console.log(parseData.cultures);
        console.log(parseData);
      } catch (err) {
        console.error(err.message)
      }
    } 
    
    fetchSessionData();
  }, [id, practice]);

  const handleDifficultyChange = (event) => {
    setSelectedDifficulty(event.target.value);
  };

  const handleCultureChange = (event) => {
    setSelectedCulture(event.target.value);
  };

  const handleAdditionalCultures = (event) => {
    var temp = [];
    for(var i=0; i < event.target.options.length; i++) {
      console.log(event.target.options[i]);
      if(event.target.options[i].selected === true) {
        temp.push(event.target.options[i].text);
      }
    }
    setAdditionalCultures(temp);
  };
    
  const cancel = () => {
    navigate("/course-enrollments");
  };

  const ok = async event => {
    console.log(selectedDifficulty);
    console.log(selectedCulture);
    console.log(additionalCultures);
    navigate("/confirmation", {state: {id: id, sessionId: sessionId, selectedDifficulty: selectedDifficulty, selectedCulture: selectedCulture, additionalCultures: additionalCultures, name: name}});
  };
  

  // temporary will remove  
  const cardCSS = {
    label: {
      margin: "28px 0px 16px"
    }
  }

  const questionSetSection = () => {
    return (
      <>
        <div className='item'>
          <label for="question-set-selection" style={cardCSS.label}>Question Set:</label>
            <div className='dropdown'>
                <select name='name' id='name'>
                  <option value={name}>{name}</option>
                </select>
                {/* <input readOnly='readonly' name='name' id='name' value={name}/> */}
            </div>
        </div>
      </>
    )
  }

  const cultureSection = () => {
    return (
      <>
      {/* error when navigation from continue-create.js page to enroll.js page
        when its creating a new account, it seems like the cultures array is empty
        the error it's throwing is a undefined property when reading 'map' */}
      <div className='item'>
        <label for="culture-selection" style={cardCSS.label}>Culture:</label>
          <div className='dropdown'>
            <select value={selectedCulture} onChange={handleCultureChange}>
              {cultureOptions.map((option, index) => (
                <option key={index} value={option.name}>
                  {option.name}
                </option>
              ))}
            </select>
        </div>
      </div>
      </>
    )
  }

  const difficultySection = () => {
    return (
      <>
      <div className='item'>
        <label style={cardCSS.label}>Difficulty:</label>
        <div className='dropdown'>
          <select value={selectedDifficulty} onChange={handleDifficultyChange}>
            {difficultyOptions.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>
      </>
    )
  }

  const additionalCultureSection = () => {
    return (
      <>
        <div className='item'>
          <label style={cardCSS.label}>Additional Cultures:</label>
            <div className='dropdown'>
              <select multiple={true} value={additionalCultures} onChange={(event) => handleAdditionalCultures(event.target.value)}>                
                {cultureOptions.filter((option) => option.name !== selectedCulture).map((option, index) => (
                  <option key={index} value={option.name}>
                    {option.name}
                  </option>
                ))}
              </select>
          </div>
        </div>
      </>
    )
  }


  const buttonSection = () => {
    return (
      <>
        <button id="login" onClick={cancel} >Cancel</button>
        <button id="createAccount" onClick={ok} >Ok</button>
      </>
    )
  }

  return (
    <>      
      {!loaded ? (
        <p>Loading...</p>
        ) : (
        <div className='Center'>
          <form onSubmit={ok}>
            <h1>{sessionName}</h1>
            {questionSetSection()}
            {cultureSection()}
            {difficultySection()}
            {additionalCultureSection()}
            {buttonSection()}
          </form>
        </div>
      )}
    </>
  );
};

export default Enroll;


