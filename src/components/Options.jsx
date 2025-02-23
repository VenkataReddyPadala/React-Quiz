import { useData } from "../context/QuizContext";
import { Actions } from "./Actions";
function Options({ question }) {
  const { dispatch, answer } = useData();

  // console.log()
  const hasAnswered = answer !== null;
  return (
    <div className="options">
      {question.options.map((option, index) => (
        <button
          className={`btn btn-option ${index === answer ? "answer" : ""} ${
            hasAnswered
              ? index === question.correctOption
                ? "correct"
                : "wrong"
              : ""
          }`}
          key={option}
          disabled={hasAnswered}
          onClick={() => dispatch({ type: Actions.NEWANSWER, payload: index })}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

export default Options;
