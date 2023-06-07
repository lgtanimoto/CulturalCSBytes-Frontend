import React, { useState } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { fetchData } from './fetchData';
import './questions.css';

const Confirmation = ({setAuth}) => {

  const navigate = useNavigate();
  const location = useLocation();
  const [errorMsg, setErrorMsg] = useState('');

  const id = location.state.id;
  const sessionId = location.state.sessionId;
  const difficulty = location.state.difficulty;
  const preferredCulture = location.state.culture;
  const additionalCultures = location.state.additionalCultures;
  const name = location.state.name;

  const cancel = () => {
    navigate("/course-enrollments");
  }

  const ok = async e => {
    e.preventDefault();

    const body = {
      preferredCulture,
      difficulty,
      additionalCultures
    };

    console.log(body);
    if(sessionId !== false) {
      const apiUrl = `/api/enrollments/${id}/sessions/${sessionId}`;
      const res = await fetchData(apiUrl, {
        method: 'PATCH',
        headers: {
          "Content-type": "application/json",
          token: localStorage.token
        },
        body: JSON.stringify(body)
      });

      if (!res.isOk) {
        setErrorMsg('network error');
        return;
      }

      const parseRes = res.data;
      console.log(parseRes);
      navigate("/questions", {state: {id: id, sessionId: sessionId, order: 1, name: name}});

    } else {
      const apiUrl = `/api/enrollments/${id}/sessions`;
      const res = await fetchData(apiUrl, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          token: localStorage.token
        },
        body: JSON.stringify(body)
      });

      if (!res.isOk) {
        setErrorMsg('network error');
        return;
      }

      const parseRes = res.data;
      console.log(parseRes);
      navigate("/questions", {state: {id: id, sessionId: parseRes.sessionId, order: 1, name: name}});

    }
  }

  return (
    <div className="Center">
      <div id="welcome">
        <h1>{name}</h1>
        <h2>20 questions : ~60 minutes</h2>
      </div>
      <button id="login" onClick={cancel}>Cancel</button>
      <button id="createAccount" onClick={ok}>Begin Session</button>
    </div>
  );
}

export default Confirmation;
