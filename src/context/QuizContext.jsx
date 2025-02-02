import { createContext, useContext, useReducer } from "react";
import { Actions } from "../components/Actions";
const QuizContext = createContext();
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
      const question =
        state.filteredQuestions.length > 0
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
function QuizProvider({ children }) {
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
  return (
    <QuizContext.Provider
      value={{
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
        dispatch,
        numQuestions,
        maxPossiblePoints,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}
function useData() {
  const context = useContext(QuizContext);
  if (context === undefined)
    throw new Error("QuizContext is used outside QuizProvider");
  return context;
}
export { QuizProvider, useData };
