import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./css/Home.module.css";

function Home() {
  const [loggedInUser, setLoggedInUser] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setLoggedInUser(localStorage.getItem("loggedInUser"));
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.welcomeMessage}>Welcome {loggedInUser}</h1>

      <h1 className={styles.header}>JavaScript Quiz </h1>

      <ol className={styles.instructions}>
        <li className={styles.instructionItem}>
          You will be asked 10 questions one after another.
        </li>
        <li className={styles.instructionItem}>
          10 points is awarded for the correct answer.
        </li>
        <li className={styles.instructionItem}>
          Each question has three options. You can choose only one option.
        </li>
        <li className={styles.instructionItem}>
          You can review and change answers before the quiz finishes.
        </li>
        <li className={styles.instructionItem}>
          The result will be declared at the end of the quiz.
        </li>
      </ol>

      <button className={styles.startButton} onClick={() => navigate("/quiz")}>
        Start Quiz
      </button>
    </div>
  );
}

export default Home;
