import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import './questions.css';
import Course from './course.js';

const CourseEnrollments = ({setAuth}) => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [courseData, setCourseData] = useState([]);
  
  async function getName() {

    try {
      const res = await fetch('/api/enrollments', {
        method: 'GET',
        headers: { token: localStorage.token },
      });

      const parseData = await res.json();
      console.log(parseData)

      setName(parseData.nickname);
      setUsername(parseData.username);

      const temp = parseData.enrollments.map((enrollment) => {
        let statusText;
        if (enrollment.status.started === false) {
          statusText = 'Not started';
        } else if (enrollment.status.completed === false) {
          statusText = 'In progress';
        } else {
          statusText = 'Finished';
        }

        return {
          id: enrollment.id,
          name: enrollment.name,
          completed: enrollment.completedSessions,
          high: enrollment.highScore,
          status: statusText,
        };
      });
      
      setCourseData(temp);
    } catch (err) {
      console.error(err.message)
    }
  }
  
  async function continueClick(id, name) {
    try {
      const res = await fetch(`/api/enrollments/${id}/sessions/continue`, {
        method: 'GET',
        headers: {
          "Content-type": "application/json",
          token: localStorage.token
        },
      });
      
      const parseData = await res.json();

      if(parseData.route === "new") {
        navigate("/enroll", {state: {id: id, name: name, practice: parseData.params ? true : false}});
      } else {
        console.log(parseData);
        navigate("/questions", {state: {id: id, sessionId: parseData.route.sessionId, order: parseData.route.questionOrder, name: name}});
      }

    } catch (err) {
      console.log(err.message);
    }
  }

  function statsClick(id, name) {
    navigate("/metrics", {state: {id: id, name: name}});
  }

  useEffect(() => {
    getName();
  }, []);

  return (
    <div className='Center'>
      <h1>Course Enrollments</h1>
      <div className='item'>
        <p>Username: {username}</p>
        <p>Nickname: {name}</p>
      </div>
      <div id='options'>
        {courseData.map((course, idx) => (
          <Course
            key={idx}
            id={course.id}
            name={course.name}
            completed={course.completed}
            high={course.high}
            status={course.status}
            statsClick={statsClick}
            continueClick={continueClick}
          />
        ))}
      </div>
      <button onClick={() => setAuth(false)}>Logout</button>
    </div>
  )
}

export default CourseEnrollments;

