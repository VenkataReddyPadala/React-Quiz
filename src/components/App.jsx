import { useEffect } from "react";
import Header from "./Header";
import MainComponent from "./MainComponent";

import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./StartScreen";
import Question from "./Question";
import { Actions } from "./Actions";
import NextButton from "./NextButton";
import Progess from "./Progess";
import FinishScreen from "./FinishScreen";
import Footer from "./Footer";
import Timer from "./Timer";
import { useData } from "../context/QuizContext";

function App() {
  const { status, dispatch } = useData();

  // const { questions, status } = state;
  // console.log(questions);

  useEffect(() => {
    async function fetchQuestions() {
      try {
        const response = await fetch(
          "https://venkatareddypadala.github.io/React_quiz_api/questions.json"
        );
        // const response = await fetch("http://localhost:8000/questions");
        // const response = await fetch("/questions.json");
        const data = await response.json();

        dispatch({ type: Actions.DATARECEIVED, payload: data.questions });
      } catch {
        dispatch({ type: Actions.DATAFAILED });
      }
    }
    fetchQuestions();
  }, []);

  return (
    <div className="app">
      <Header />
      <MainComponent>
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && <StartScreen />}
        {status === "active" && (
          <>
            <Progess />
            <Question />
            <Footer>
              <Timer />
              <NextButton />
            </Footer>
          </>
        )}
        {status === "finished" && <FinishScreen />}
        {status === "review" && (
          <>
            <Question />
            <NextButton />
          </>
        )}
      </MainComponent>
    </div>
  );
}

export default App;
