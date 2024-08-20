import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./css/QuizComponent.module.css";

const QuizComponent = React.memo(
  ({ data, selectedOptions, setSelectedOptions }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [permissionsGranted, setPermissionsGranted] = useState(false);
    const videoRef = useRef(null);
    const streamRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
      const requestPermissions = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
          });
          setPermissionsGranted(true);
          streamRef.current = stream;

          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.onloadedmetadata = () => {
              videoRef.current.play();
            };
          }
        } catch (error) {
          console.error("Error accessing media devices.", error);
          setPermissionsGranted(false);
        }
      };
      requestPermissions();
      return () => {
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }
      };
    }, []);

    const handlePreviousQuestion = () => {
      if (currentQuestionIndex > 0) {
        setCurrentQuestionIndex(currentQuestionIndex - 1);
      }
    };

    const handleNextQuestion = () => {
      if (currentQuestionIndex < data.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      }
    };

    const handleOptionSelect = (index) => {
      const updatedOptions = [...selectedOptions];
      updatedOptions[currentQuestionIndex] = index;
      setSelectedOptions(updatedOptions);
    };

    const handleSubmitQuiz = () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop()); 
        streamRef.current = null; 
      }
      navigate("/result");
    };

    const progressBarWidth = ((currentQuestionIndex + 1) / data.length) * 100;

    const handleQuestionClick = (index) => {
      setCurrentQuestionIndex(index);
    };

    return (
      <>
        <div className={styles.quizContainer}>
          {permissionsGranted ? (
            <div className={styles.quizContent}>
              <div className={styles.questionNavigation}>
                {data.map((_, index) => (
                  <button
                    key={index}
                    className={`${styles.navButton} ${
                      currentQuestionIndex === index
                        ? styles.activeQuestion
                        : styles.inactiveQuestion
                    }`}
                    onClick={() => handleQuestionClick(index)}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>

              <h2>
                Question {currentQuestionIndex + 1} of {data.length}
              </h2>

              <div className={styles.progressBarContainer}>
                <div
                  className={styles.progressBar}
                  style={{ width: `${progressBarWidth}%` }}
                ></div>
              </div>

              <p className={styles.question}>
                {data[currentQuestionIndex].question}
              </p>

              <div className={styles.options}>
                {data[currentQuestionIndex].options.map((option, index) => (
                  <div key={index} className={styles.option}>
                    <input
                      type="radio"
                      id={`option-${index}`}
                      name={`question-${currentQuestionIndex}`}
                      value={option}
                      checked={selectedOptions[currentQuestionIndex] === index}
                      onChange={() => handleOptionSelect(index)}
                    />
                    <label htmlFor={`option-${index}`}>{option}</label>
                  </div>
                ))}
              </div>

              <div className={styles.quizNavigation}>
                <button
                  onClick={handlePreviousQuestion}
                  className={`${styles.navButton} ${styles.startButton} ${styles.buttonSpacing}`}
                  disabled={currentQuestionIndex === 0}
                >
                  Previous
                </button>

                {currentQuestionIndex < data.length - 1 ? (
                  <button
                    className={`${styles.navButton} ${styles.startButton}`}
                    onClick={handleNextQuestion}
                  >
                    Next
                  </button>
                ) : (
                  <button
                    className={`${styles.navButton} ${styles.startButton}`}
                    onClick={handleSubmitQuiz}
                  >
                    Submit Quiz
                  </button>
                )}
              </div>
            </div>
          ) : (
            <p>Requesting camera and microphone permissions...</p>
          )}
        </div>

        <div
          className="live-feed"
          style={{
            position: "absolute",
            top: "5px",
            right: "5px",
            width: "300px",
          }}
        >
          <video
            ref={videoRef}
            autoPlay
            playsInline
            style={{
              width: "100%",
              borderRadius: "8px",
            }}
          />
        </div>
      </>
    );
  }
);

export default QuizComponent;
