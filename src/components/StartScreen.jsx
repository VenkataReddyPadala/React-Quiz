import { Actions } from "./Actions";
const languages = ["ALL", "HTML", "CSS", "React"];
const difficultyLevels = ["ALL", "easy", "medium", "hard"];

function StartScreen({ numQuestions, dispatch, difficulty, language }) {
  return (
    <div className="start">
      <h2>Welcome to the Quiz </h2>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "20px",
          alignItems: "center",
        }}
      >
        <span
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "20px",
            alignItems: "center",
          }}
        >
          <p style={{ fontSize: "2rem" }}> Select Language</p>
          <select
            style={{ display: "inline" }}
            className="btn "
            value={language}
            onChange={(e) =>
              dispatch({
                type: Actions.LANGUAGE,

                payload: e.target.value,
              })
            }
          >
            {languages.map((language) => (
              <option value={language} key={language}>
                {language}
              </option>
            ))}
          </select>
        </span>
        <span
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "20px",
            alignItems: "center",
          }}
        >
          <p style={{ fontSize: "2rem" }}> Select difficulty</p>
          <select
            style={{ display: "inline" }}
            className="btn "
            value={difficulty}
            onChange={(e) =>
              dispatch({
                type: Actions.DIFFICULTY,

                payload: e.target.value,
              })
            }
          >
            {difficultyLevels.map((level) => (
              <option value={level} key={level}>
                {level}
              </option>
            ))}
          </select>
        </span>
      </div>
      <h3>{numQuestions} questions to test your React mastery</h3>
      <button
        className="btn btn-ui"
        disabled={numQuestions === 0}
        onClick={() => dispatch({ type: Actions.START })}
      >
        Let&apos;s start
      </button>
    </div>
  );
}

export default StartScreen;
