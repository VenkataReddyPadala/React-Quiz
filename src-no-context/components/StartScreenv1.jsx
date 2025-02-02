import { Actions } from "./Actions";

function StartScreen({ numQuestions, dispatch }) {
  return (
    <div className="start">
      <h2>Welcome to the react Quiz</h2>
      <h3>{numQuestions} questions to test your React mastery</h3>
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: Actions.START })}
      >
        Let&apos;s start
      </button>
    </div>
  );
}

export default StartScreen;
