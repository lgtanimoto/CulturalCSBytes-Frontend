import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import './questions.css';

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

      try {
        const res = await fetch(`api/enrollments/${id}/sessions/new${practice ? '?practice=true' : ''}`, {
          method: 'GET',
          headers: {token: localStorage.token}
        });

        const parseData = await res.json();

        setLoaded(true);
        setSessionId(parseData.sessionId);
        setSessionName(parseData.sessionName);
        setDifficultyOptions(parseData.difficulties);
        setCultureOptions(parseData.cultures);

        console.log(parseData.cultures);
        console.log(parseData);
      } catch (err) {
        console.log(err.message)
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

  const cancel = () => {
    navigate("/course-enrollments");
  };

  const ok = async e => {
    console.log(selectedDifficulty);
    console.log(selectedCulture);
    console.log(additionalCultures);
    navigate("/confirmation", {state: {id: id, sessionId: sessionId, selectedDifficulty: selectedDifficulty, selectedCulture: selectedCulture, additionalCultures: additionalCultures, name: name}});
  };

  return (
    <>
      {!loaded ? (
        <p>Loading...</p>
      ) : (
        <div className='center'>
          <h1>{sessionName}</h1>
          <div className='item'>
            <p>Question Set:</p>
            <div className='dropdown'>
              <select name='name' id='name'>
                <option value={name}>{name}</option>
              </select>
            </div>
          </div>

          <div className='item'>
            <p>Culture:</p>
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

          <div className='item'>
            <p>Difficulty:</p>
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
          
          <div className='item'>
            <p>Additional Cultures:</p>
            <div className='dropdown'>
              <select multiple={true} value={additionalCultures} onChange={(event) => setAdditionalCultures(event.target.value)}>
                {cultureOptions.filter((option) => option.name !== selectedCulture).map((option, index) => (
                  <option key={index} value={option.name}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button id="login" onClick={cancel} >Cancel</button>
          <button id="createAccount" onClick={ok} >Ok</button>
        </div>
      )}
    </>
  );
};

export default Enroll;