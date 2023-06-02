import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import './questions.css';


const CourseEnrollments = ({setAuth}) => {

  const navigate = useNavigate();

  // setting the stage to grab the name, userName, and courseData
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [courseData, setCourseData] = React.useState([]);

  const courseSection = ({statsClick, continueClick, id, name, completed, high, status}) =>{
    return (
        // <div className="course">
          <tbody>
            <tr>
                <td>{name}</td>
                <td>{completed}</td>
                <td>{high}&#37;</td>
                <td>{status}</td>
                <td className="stats_cont"><button type="button" onClick={() => statsClick(id, name)}>
            Stats
            </button>
            <button  type="button" onClick={() => continueClick(id, name)}>
            Continue
            </button></td>
            </tr>
          </tbody>
        // </div>
    )
}

  // async function grabbing the name from an api fetch call 
  // and using get request to store data into respond variable
  async function getName() {
    try {
      const res = await fetch('/api/enrollments', {
        method: 'GET',
        headers: { token: localStorage.token }
      });
      
      // respond data is now a json object stored into parseData
      const parseData = await res.json();
      console.log(parseData)

      setName(parseData.nickname);
      setUsername(parseData.username);

      var temp = [];
      for(var i=0; i<parseData.enrollments.length; i++){
        var statusText;
        if(parseData.enrollments[i].status.started === false) {
          statusText = "Not started";
        } else if(parseData.enrollments[i].status.completed === false) {
          statusText = "In progress";
        } else {
          statusText = "Finished";
        }
        temp.push({
          id: parseData.enrollments[i].id,
          name: parseData.enrollments[i].name,
          completed: parseData.enrollments[i].completedSessions,
          high: parseData.enrollments[i].highScore,
          status: statusText,
        })
      };
      setCourseData(temp);

    } catch (err) {
      console.error(err.message);
    }
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

  useEffect(() => {
    getName()
  }, []);

  // fetch's need to be inside of a useEffect(..., ....)
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

      // this format for checking user's info should also be in continue-create.js before navigating to enroll.js
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

  //TO DO: get nickname from backend on login
  return(
    <div className='tables_center'>
      <h1>Course Enrollments</h1>
      <div className="item">
        {<p>Username: {username}</p>
        }<p>Nickname: {name}</p>
      </div>
      {/* <div id="options"> */}
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
      {/* </div> */}
      <button onClick={() => setAuth(false)}>Logout</button>
    </div>
  );
}

export default CourseEnrollments;