import React, { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import './questions.css';

const Recommendations = ({setAuth}) => {

  // setting up the page navigation and location state info -----------------------------------
  const navigate = useNavigate();
  const location = useLocation();

  // using location state to get state info passed down from last page --------------------------
  const id = location.state.id;
  const sessionId = location.state.sessionId;
  const enrollmentName = location.state.enrollmentName;

  // setting all the initial states to be used later ------------------------------
  const [nickname, setNickname] = useState("");
  const [correct, setCorrect] = useState("");
  const [totalQuestions, setTotalQuestions] = useState("");
  const [sessionName, setSessionName] = useState("");
  const [culture, setCulture] = useState([]);
  const [questionSet, setQuestionSet] = useState([]);
  const [questionsMissed, setQuestionsMissed] = useState([]);

  // fetch function to call to backend to get info to fill all the empty states -------------------------------
  async function getRecommendations() {
    try {
      const res = await fetch(`/api/enrollments/${id}/sessions/${sessionId}/recommendations`, {
        method: 'GET',
        headers: { token: localStorage.token }
      });

      const parseData = await res.json();
      console.log(parseData);

      // filling in the states with the fetched data from json request
      setNickname(parseData.nickname);
      setCorrect(parseData.correct);
      setTotalQuestions(parseData.totalQuestions);
      setSessionName(parseData.sessionName);
      setCulture(parseData.resources.culture);
      setQuestionSet(parseData.resources.questionSet);
      setQuestionsMissed(parseData.resources.questionsMissed);

    } catch (err) {
      console.log(err.message);
    }
  }

  // dont know what this is right now??? --------------------
  useEffect(() => {
    getRecommendations()
    // eslint-disable-next-line
  }, []);

  
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
