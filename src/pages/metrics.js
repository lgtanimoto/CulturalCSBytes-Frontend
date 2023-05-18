import React, { useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import './questions.css';

const Metrics = ({setAuth}) => {

  const navigate = useNavigate();
  const location = useLocation();

  const id = location.state.id;
  const name = location.state.name;

  const [username, setUsername] = React.useState("");
  const [nickname, setNickname] = React.useState("");
  const [sessions, setSessions] = React.useState([]);


  const metricSection = ({name, date, cultures, correct, totalQuestions}) => {
      return (
          <tbody>
              <tr>
              <td>{name}</td>
              {cultures ? (
                  <td>{date.split("T")[0]}</td>
              ) : (
                  <td>Expected: {date.split("T")[0]}</td>
              )}
              {cultures ? (
                  <td>{cultures}</td>
              ) : (
                  <td>N/A</td>
              )}
              {cultures ? (
                  <td>{correct}/{totalQuestions}</td>
              ) : (
                  <td>N/A</td>
              )}
              </tr>
          </tbody>
      )
  }     

  async function getMetrics() {
    try {
      const res = await fetch(`/api/enrollments/${id}`, {
        method: 'GET',
        headers: { token: localStorage.token }
      });
        
      const parseData = await res.json();
      console.log(parseData);

      setUsername(parseData.username);
      setNickname(parseData.nickname);
      setSessions(parseData.sessions);

    } catch (err) {
      console.log(err.message);
    }
  }

  const headerSection = () => {
    return (
        <thead>
            <tr>
                <th>Session</th>
                <th>Date</th>
                <th>Cultures</th>
                <th>Score</th>
            </tr>
        </thead>
    )
}

  useEffect(() => {
    getMetrics();
  })


  const goBack = () => {
    navigate("/course-enrollments");
  }

  return (
    <div className="tables_center">
      <div id="welcome">
        <h1>Enrollment Metrics</h1>
      </div>
      <div className="item">
        <p>Username: {username}</p>
        <p>Nickname: {nickname}</p>
        <p>Enrollment Name: {name}</p>
      </div>
      <div>
        <table className="table">
        {headerSection()}
        {sessions?.map(
            (session, idx) => {
            if (sessions != null) {
                return metricSection({
                key: idx,
                id: session.id,
                name: session.name,
                date: session.date,
                cultures: session.cultures,
                correct: session.correct,
                totalQuestions: session.totalQuestions,
                isOfficialSession: session.isOfficialSession });
            } else {
                return (<div />);
            }
            }
        )}
        </table>
      </div>
      <button onClick={goBack}>Back to Courses</button>
    </div>
  );
}

export default Metrics;
