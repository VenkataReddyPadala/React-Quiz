import { useEffect } from "react";
import Header from "./Header";
import MainComponent from "./MainComponent";
import { useReducer } from "react";
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

const SECS_PER_QUESTION = 30;
const initialState = {
  questions: [],
  status: "loading",
  index: 0,
  answer: null,
  allAnswers: [],
  points: 0,
  highscore: 0,
  secondsRemaining: null,
};

function reducer(state, action) {
  switch (action.type) {
    case Actions.DATARECEIVED:
      return { ...state, questions: action.payload, status: "ready" };
    case Actions.DATAFAILED:
      return { ...state, status: "error" };
    case Actions.START:
      return {
        ...state,
        status: "active",
        secondsRemaining: state.questions.length * SECS_PER_QUESTION,
      };
    case Actions.NEWANSWER: {
      const question = state.questions.at(state.index);
      return {
        ...state,
        answer: action.payload,
        points:
          question.correctOption === action.payload
            ? state.points + question.points
            : state.points,
        allAnswers: [...state.allAnswers, action.payload],
      };
    }
    case Actions.NEXTQUESTION:
      return {
        ...state,
        index: state.index + 1,
        answer:
          state.status === Actions.REVIEW
            ? state.allAnswers[state.index + 1]
            : null,
      };
    case Actions.FINISHED:
      return {
        ...state,
        status: "finished",
        highscore:
          state.points > state.highscore ? state.points : state.highscore,
      };
    case Actions.RESTART:
      return {
        ...initialState,
        questions: state.questions,
        status: "ready",
        highscore: state.highscore,
      };
    case Actions.TICK:
      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
        status: state.secondsRemaining <= 0 ? "finished" : state.status,
      };
    case Actions.REVIEW:
      return {
        ...state,
        index: 0,
        status: "review",
        secondsRemaining: null,
        answer: state.allAnswers[0],
      };
    default:
      throw new Error("Action unknown");
  }
}

function App() {
  const [
    {
      questions,
      status,
      index,
      answer,
      points,
      highscore,
      secondsRemaining,
      allAnswers,
    },
    dispatch,
  ] = useReducer(reducer, initialState);

  const numQuestions = questions.length;
  const maxPossiblePoints = questions.reduce(
    (prev, cur) => prev + cur.points,
    0
  );

  // const { questions, status } = state;

  useEffect(() => {
    async function fetchQuestions() {
      try {
        const response = await fetch("http://localhost:8000/questions");
        const data = await response.json();
        dispatch({ type: Actions.DATARECEIVED, payload: data });
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
        {status === "ready" && (
          <StartScreen numQuestions={numQuestions} dispatch={dispatch} />
        )}
        {status === "active" && (
          <>
            <Progess
              index={index}
              numQuestions={numQuestions}
              points={points}
              maxPossiblePoints={maxPossiblePoints}
              answer={answer}
            />
            <Question
              question={questions[index]}
              dispatch={dispatch}
              answer={answer}
            />
            <Footer>
              <Timer dispatch={dispatch} secondsRemaining={secondsRemaining} />
              <NextButton
                dispatch={dispatch}
                answer={answer}
                lastIndex={index === numQuestions - 1}
              />
            </Footer>
          </>
        )}
        {status === "finished" && (
          <FinishScreen
            points={points}
            maxPossiblePoints={maxPossiblePoints}
            highscore={highscore}
            dispatch={dispatch}
          />
        )}
        {status === "review" && (
          <>
            <Question
              question={questions[index]}
              dispatch={dispatch}
              answer={allAnswers[index]}
            />
            <NextButton
              dispatch={dispatch}
              answer={answer[index]}
              lastIndex={index === numQuestions - 1}
            />
          </>
        )}
      </MainComponent>
    </div>
  );
}

export default App;
