import React, { useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./css/ResultComponent.module.css";

const ResultComponent = ({ data, selectedOptions, setSelectedOptions }) => {
  const navigate = useNavigate();
  const videoRef = useRef(null);

  const calculateScore = () => {
    const answers = data.map((question) => question.correctAnswerIndex);
    return selectedOptions.reduce((score, option, index) => {
      return score + (option === answers[index] ? 1 : 0);
    }, 0);
  };

  const score = calculateScore();
  const email = localStorage.getItem("email");

  useEffect(() => {
    const stopCameraStream = () => {
      const stream = videoRef.current?.srcObject;
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
    };

    const sendResults = async () => {
      try {
        await axios.post(
          "https://cipherschools-mcq-test-portal-backend.onrender.com/send-results",
          {
            email,
            score,
            data,
            selectedOptions,
          }
        );
      } catch (error) {
        console.error("Error sending results:", error);
      }
    };

    stopCameraStream();
    sendResults();
  }, [email, score, data, selectedOptions]);
  
  const handleRetakeQuiz = () => {
    setSelectedOptions([]);
    navigate("/home");
  };

  const handleLogout = (e) => {
    localStorage.removeItem("token");
    localStorage.removeItem("loggedInUser");
    toast.success("User Logged out");
    setTimeout(() => {
      navigate("/login");
    }, 1000);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.header}>Thank you for attempting the quiz!</h2>
      <p>Your results will be sent to your email shortly.</p>
      <br />
      <div style={{ display: "flex", gap: "10px" }}>
        <button className={styles.button} onClick={handleRetakeQuiz}>
          Retake Quiz
        </button>
        <button className={styles.button} onClick={handleLogout}>
          Logout
        </button>
      </div>
      <ToastContainer className={styles.toastContainer} />
    </div>
  );
};

export default ResultComponent;