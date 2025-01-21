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
  filteredQuestions: [],
  status: "loading",
  index: 0,
  answer: null,
  allAnswers: [],
  points: 0,
  highscore: 0,
  secondsRemaining: null,
  language: "ALL",
  difficulty: "ALL",
};

function reducer(state, action) {
  switch (action.type) {
    case Actions.DATARECEIVED:
      console.log(action.payload);
      return { ...state, questions: action.payload, status: "ready" };
    case Actions.DATAFAILED:
      return { ...state, status: "error" };
    case Actions.LANGUAGE: {
      if (action.payload === "ALL" && state.difficulty === "ALL") {
        return { ...state, language: "ALL", filteredQuestions: [] };
      }
      let filterArray = state.questions.filter(
        (question) => question.language === action.payload
      );
      if (action.payload === "ALL") {
        filterArray = state.questions.filter(
          (question) => question.difficulty === state.difficulty
        );
      }

      if (state.difficulty !== "ALL") {
        filterArray = filterArray.filter(
          (question) => question.difficulty === state.difficulty
        );
      }
      return {
        ...state,
        filteredQuestions: filterArray,
        language: action.payload,
      };
    }
    case Actions.DIFFICULTY: {
      if (action.payload === "ALL" && state.language === "ALL") {
        return { ...state, difficulty: "ALL", filteredQuestions: [] };
      }
      let filterArray = state.questions.filter(
        (question) => question.difficulty === action.payload
      );
      if (action.payload === "ALL") {
        filterArray = state.questions.filter(
          (question) => question.language === state.language
        );
      }
      if (state.language !== "ALL") {
        filterArray = filterArray.filter(
          (question) => question.language === state.language
        );
      }
      return {
        ...state,
        filteredQuestions: filterArray,
        difficulty: action.payload,
      };
    }
    case Actions.START:
      return {
        ...state,
        status: "active",
        secondsRemaining:
          (state.filteredQuestions.length || state.questions.length) *
          SECS_PER_QUESTION,
      };
    case Actions.NEWANSWER: {
      const question = state.filteredQuestions
        ? state.filteredQuestions.at(state.index)
        : state.questions.at(state.index);
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
      language,
      difficulty,
      filteredQuestions,
    },
    dispatch,
  ] = useReducer(reducer, initialState);

  const numQuestions = filteredQuestions?.length || questions.length;

  const maxPossiblePoints =
    filteredQuestions?.reduce((prev, cur) => prev + cur.points, 0) ||
    questions.reduce((prev, cur) => prev + cur.points, 0);

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
        {status === "ready" && (
          <StartScreen
            numQuestions={numQuestions}
            dispatch={dispatch}
            language={language}
            difficulty={difficulty}
          />
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
              question={filteredQuestions[index] || questions[index]}
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
              question={filteredQuestions[index] || questions[index]}
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
