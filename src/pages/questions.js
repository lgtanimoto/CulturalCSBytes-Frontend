import React, { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import './questions.css';
import parse from 'html-react-parser';
import { Buffer } from 'buffer';
import { fetchData } from './fetchData';

const Questions = ({setAuth}) => {

  const navigate = useNavigate();
  const location = useLocation();

  const id = location.state.id;
  const sessionId = location.state.sessionId;
  const enrollmentName = location.state.name;
  const [order, setOrder] = useState(location.state.order);
  const [numOfQuestions, setNumOfQuestions] = useState(20);

  const [curQuestion, setCurQuestion] = React.useState("");
  const [answer1, setAnswer1] = React.useState("Answer 1"); 
  const [answer2, setAnswer2] = React.useState("Answer 2"); 
  const [answer3, setAnswer3] = React.useState("Answer 3"); 
  const [answer4, setAnswer4] = React.useState("Answer 4"); 
  const [correctAnswer, setCorrectAnswer] = React.useState(0); 
  const [explanation, setExplanation] = React.useState("");
  const [errorMsg, setErrorMsg] = useState('');
  
  const [answered, setAnswered] = useState(false);

  async function getQuestion() {

    console.log("id = " + id);
    console.log("sessionId = " + sessionId);
    
    const apiUrl = `/api/enrollments/${id}/sessions/${sessionId}/questions/${order}`;
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

    return parseData; 
  }

  function displayQuestions(parseData) {
    if(parseData.hasOwnProperty("questionJson")) {
      setCurQuestion(parseData.questionJson.Question);
      setAnswer1(parseData.questionJson.Answer1);
      setAnswer2(parseData.questionJson.Answer2);
      setAnswer3(parseData.questionJson.Answer3);
      setAnswer4(parseData.questionJson.Answer4);
      setCorrectAnswer(parseData.questionJson.CorrectAnswer);
      setExplanation(parseData.questionJson.Explanation);
      setNumOfQuestions(parseData.totalQuestions);
      setAnswered(parseData.studentAnswer !== null);

      if(parseData.imagesBlob !== null) {
        const buffer = Buffer.from(parseData.imagesBlob.data);
        document.getElementById("qimg0").src = `data:image/jpeg;base64,${buffer.toString('base64')}`;
      }

      if (parseData.studentAnswer !== null) {
        if(parseData.studentAnswer === correctAnswer) {
            document.getElementById(parseData.studentAnswer).style.backgroundColor = "green";
            document.getElementById("explanation").style.display = "block";
        } else {
            document.getElementById(parseData.studentAnswer).style.backgroundColor = "red";
            document.getElementById(correctAnswer).style.backgroundColor = "green";
            document.getElementById("explanation").style.display = "block";
        }
        const nonAnswers = [1, 2, 3, 4].filter(x => x !== parseData.studentAnswer && x !== correctAnswer);
        for (let i = 0; i < nonAnswers.length; i++) {
          document.getElementById(nonAnswers[i]).style.backgroundColor = "white";
        }
        setAnswered(true);
      }

      console.log("question: " + order + "/" + numOfQuestions);
    }
  }

  async function submitAnswer(answer) {
    const body = {answer};

    const apiUrl = `/api/enrollments/${id}/sessions/${sessionId}/questions/${order}`;
    const res = await fetchData(apiUrl, {
      method: 'PATCH',
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
    setAnswered(true);
  }

  async function continueSession() {
    const body = { next: true };

    const apiUrl = `/api/enrollments/${id}/sessions/${sessionId}/questions/${order}`;
    const response = await fetchData(apiUrl, {
      method: 'PATCH',
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

    const parseData = res.data;
    console.log(parseRes);
  }

  useEffect(() => {
    getQuestion().then((parseData) => displayQuestions(parseData));
  }, [])

  function answerClick(answer) {
    if(answered === false) {
        submitAnswer(answer);
    }
  }

  const goBack = () => {
    navigate("/course-enrollments");
  }

  const nextQuestion = () => {
    if (answered === true) {
      console.log("order = " + order + "  numOfQuestions = " + numOfQuestions);
      continueSession().then(result => {
        if (order < numOfQuestions) {
          document.getElementById(1).style.backgroundColor = "white";
          document.getElementById(2).style.backgroundColor = "white";
          document.getElementById(3).style.backgroundColor = "white";
          document.getElementById(4).style.backgroundColor = "white";
          document.getElementById("explanation").style.display = "none";
          setOrder(order + 1);
          setAnswered(false);
        } else {
          navigate("/recommendations", {state: {id: id, sessionId: sessionId, enrollmentName: enrollmentName}});
        }
      });
    }
  }

  return (
    <div id="Questions">
      <div id="welcome">
        <h1>Question {order} of {numOfQuestions}</h1>
      </div>
      <button onClick={goBack}>Back to Courses</button>
      <div>{parse(curQuestion)}</div>
      <div className="Answer">
        <button id="1" onClick={() => answerClick("1")}>{parse(answer1)}</button>
      </div>
      <div className="Answer">
        <button id="2" onClick={() => answerClick("2")}>{parse(answer2)}</button>
      </div>
      <div className="Answer">
        <button id="3" onClick={() => answerClick("3")}>{parse(answer3)}</button>
      </div>
      <div className="Answer">
        <button id="4" onClick={() => answerClick("4")}>{parse(answer4)}</button>
      </div>
      <div id="explanation">{parse(explanation)}</div>
      <button onClick={nextQuestion}>Next</button>
    </div>
  );
}

export default Questions;
