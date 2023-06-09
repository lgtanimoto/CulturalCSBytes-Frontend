import React, { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { fetchData } from './fetchData';
import './questions.css';

const Recommendations = ({setAuth}) => {

  // setting up the page navigation and location state info -----------------------------------
  const navigate = useNavigate();
  const location = useLocation();

  // using location state to get state info passed down from last page --------------------------
  const id = location.state.id;
  const sessionId = location.state.sessionId;
  const enrollmentName = location.state.enrollmentName;

  const [nickname, setNickname] = React.useState("");
  const [correct, setCorrect] = React.useState("");
  const [totalQuestions, setTotalQuestions] = React.useState("");
  const [sessionName, setSessionName] = React.useState("");
  const [culture, setCulture] = React.useState([]);
  const [questionSet, setQuestionSet] = React.useState([]);
  const [questionsMissed, setQuestionsMissed] = React.useState([]);
  const [errorMsg, setErrorMsg] = useState('');

  // fetch function to call to backend to get info to fill all the empty states -------------------------------
  async function getRecommendations() {
    
    const apiUrl = `/api/enrollments/${id}/sessions/${sessionId}/recommendations`;
    const res = await fetchData(apiUrl, {
      method: 'GET',
      headers: { token: localStorage.token }
    });

    if (!res.isOk) {
      setErrorMsg('network error');
      return;
    }

    const parseData = res.data;
    console.log(parseData);

    setNickname(parseData.nickname);
    setCorrect(parseData.correct);
    setTotalQuestions(parseData.totalQuestions);
    setSessionName(parseData.sessionName);
    setCulture(parseData.resources.culture);
    setQuestionSet(parseData.resources.questionSet);
    setQuestionsMissed(parseData.resources.questionsMissed);

  }

  // dont know what this is right now??? --------------------
  useEffect(() => {
    getRecommendations();
  }, [])

  
 //  welcome section o ----------------------
  const welcome = () => {
    return (
      <>
        <div id="welcome">
          <h1>Recommendations</h1>
        </div>

        <p>
          Congratulations, <b>{nickname}</b>. 
          You got <b>{correct}</b> out of <b>{totalQuestions}</b> correct in your <b>{sessionName}</b> in enrollment <b>{enrollmentName}</b>. 
          Great work so far! Come back in a few weeks to test again.
        </p>

        <p>
          To keep improving your CS skills, please check out the following resources 
        </p>
      </>
    )
  } // end of welcome page

  // recommendations section -------------------------------------------
  const recommendations = () => {
    return (
      <>
        <div id="recommendations">
          <div>
            {culture}
          </div>

          <div>
              {questionSet.map(
              (question) => {
                if (questionSet != null) {
                  return (<div><a href={question.url}>{question.title}</a><br></br></div>);
                } else {
                  return (<div />);
                }
              }
            )}
          </div>

        <div>
          {questionsMissed}
        </div>

      </div>
      </>
    )
  } // end of recommendations

  // back button section ------------------------------------
  const backButton = () => {
    return (
      <>
        <button onClick={goBack}>Back to Courses</button>
      </>
    )
  }

  // the go back function ---------------------------------------------
  const goBack = () => {
    navigate("/course-enrollments");
  } // end go back button
  
  // page render return section --------------------------------
  return (
    <div className="Center">
      {welcome()}
      {recommendations()}
      {backButton()}
    </div>
  );
}

export default Recommendations;
