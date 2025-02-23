import { useData } from "../context/QuizContext";
import { Actions } from "./Actions";
function NextButton() {
  const { dispatch, answer, index, numQuestions } = useData();
  const lastIndex = index === numQuestions - 1;
  if (answer === null) return;
  return (
    <button
      className="btn btn-ui"
      onClick={() =>
        lastIndex
          ? dispatch({ type: Actions.FINISHED })
          : dispatch({ type: Actions.NEXTQUESTION })
      }
    >
      {lastIndex ? "Finish" : "Next"}
    </button>
  );
}

export default NextButton;
