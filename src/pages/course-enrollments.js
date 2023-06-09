import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import './questions.css';
// when importing this, must use this style {export const} 
  // using {} since we exported const as a function
  // when exporting a react functional component, we export defualt
import {fetchData} from "./fetchData.js";


const CourseEnrollments = ({setAuth}) => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [courseData, setCourseData] = React.useState([]);
  const [errorMsg, setErrorMsg] = useState('');


  const courseSection = ({statsClick, continueClick, id, name, completed, high, status}) =>{
    return (
        // <div className="course">
          <tbody>
            <tr>
                <td>{name}</td>
                <td>{completed}</td>
                <td>{high}&#37;</td>
                <td>{status}</td>
                <td className="stats_cont">
                  <button type="button" disabled={status === "Not started"} onClick={() => statsClick(id, name)}>
                    Stats
                  </button>
                  <button type="button" onClick={() => continueClick(id, name)}>
                    {status === "Not started" ? "Start" : "Continue"}
                  </button>
                </td>
            </tr>
          </tbody>
        // </div>
    )
}

  async function getName() {

    const apiUrl = '/api/enrollments';
    const res = await fetchData(apiUrl, {
      method: 'GET',
      headers: { token: localStorage.token },
    });
    
    if (!res.isOk) {
      setErrorMsg('network error');
      return;
    }

    const parseData = res.data;
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
      
    })

    setCourseData(temp);
  };
  

  const topSection = () => {
    return (
      <>
        <h1>Course Enrollments</h1>
          <div className='item'>
            <p>Username: {username}</p>
            <p>Nickname: {name}</p>
          </div>
      </>
    )
  }

  const courseHeaderSection = () => {
    return (
        <thead>
            <tr>
                <th>Course</th>
                <th>Completed</th>
                <th>High Score</th>
                <th>Status</th>
            </tr>
        </thead>
    )
}

const tableSection = () => {
  return (
    <>
      <table>
        {courseHeaderSection()}
            {courseData.map(
             (course, idx) => {
               if (courseData != null) {
                 return courseSection({
                 key: idx,
                 id: course.id,
                 name: course.name,
                 completed: course.completed,
                 high: course.high,
                 status: course.status,
                 statsClick: statsClick,
                 continueClick: continueClick });
               } else {
                 return (<div />);
               }
             }
           )}
      </table>
    </>
  )
}

const buttonSection = () => {
  return (
    <>
      <button onClick={() => setAuth(false)}>Logout</button>
    </>
  )
}

  useEffect(() => {
    getName()
  }, []);

  // fetch's need to be inside of a useEffect(..., ....)
  async function continueClick(id, name) {

    const apiUrl = `/api/enrollments/${id}/sessions/continue`;
    const res = await fetchData(apiUrl, {
      method: 'GET',
      headers: {
        "Content-type": "application/json",
        token: localStorage.token
      },
    });

    if (!res.isOk) {
      setErrorMsg('network error');
      return;
    }
    
    const parseData = res.data;

    if(parseData.route === "new") {
      navigate("/enroll", {state: {id: id, name: name, practice: parseData.params ? true : false}});
    } else {
      console.log(parseData);
      navigate("/questions", {state: {id: id, sessionId: parseData.route.sessionId, order: parseData.route.questionOrder, name: name}});
    }
  }

  function statsClick(id, name) {
    navigate("/metrics", {state: {id: id, name: name}});
  }

  //TO DO: get nickname from backend on login
  return(
    <div className='tables_center'>
          {topSection()}
          {tableSection()}
          {buttonSection()}
    </div>
  )
}

export default CourseEnrollments;

