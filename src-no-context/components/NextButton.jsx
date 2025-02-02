import { Actions } from "./Actions";
function NextButton({ dispatch, answer, lastIndex }) {
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
