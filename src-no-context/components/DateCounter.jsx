import { useState, useReducer } from "react";

const Action = {
  INCREMENT_COUNT: "increment_count",
  DECREMENT_COUNT: "decrement_count",
  STEP_CHANGE: "step_change",
  COUNT_CHANGE: "count_change",
  RESET: "reset",
};

const initialState = {
  count: 0,
  step: 1,
};

function reducer(state, action) {
  switch (action.type) {
    case Action.INCREMENT_COUNT:
      return { ...state, count: state.count + state.step };

    case Action.DECREMENT_COUNT:
      return { ...state, count: state.count - state.step };
    case Action.STEP_CHANGE:
      return { ...state, step: action.payload };
    case Action.COUNT_CHANGE:
      return { ...state, count: action.payload };
    case Action.RESET:
      return initialState;
    default:
      return state;
  }
}

function DateCounter() {
  // const [count, setCount] = useState(0);
  // const [step, setStep] = useState(1);

  const [state, dispatch] = useReducer(reducer, initialState);
  // const [stepState, dispatch] = useReducer(reducer,{step:1})

  // This mutates the date object.
  const date = new Date("june 21 2027");
  date.setDate(date.getDate() + state.count);

  const dec = function () {
    // setCount((count) => count - 1);
    // setCount((count) => count - step);
    dispatch({ type: Action.DECREMENT_COUNT });
  };

  const inc = function () {
    // setCount((count) => count + 1);
    // setCount((count) => count + step);
    dispatch({ type: Action.INCREMENT_COUNT });
  };

  const defineCount = function (e) {
    // setCount(Number(e.target.value));
    dispatch({ type: Action.COUNT_CHANGE, payload: Number(e.target.value) });
  };

  const defineStep = function (e) {
    // setStep(Number(e.target.value));
    dispatch({ type: Action.STEP_CHANGE, payload: Number(e.target.value) });
  };

  const reset = function () {
    // setCount(0);
    // setStep(1);
    // dispatch({ type: Action.STEP_CHANGE, payload: 1 });
    // dispatch({ type: Action.COUNT_CHANGE, payload: 0 });
    dispatch({ type: Action.RESET });
  };

  return (
    <div className="counter">
      <div>
        <input
          type="range"
          min="0"
          max="10"
          value={state.step}
          onChange={defineStep}
        />
        <span>{state.step}</span>
      </div>

      <div>
        <button onClick={dec}>-</button>
        <input value={state.count} onChange={defineCount} />
        <button onClick={inc}>+</button>
      </div>

      <p>{date.toDateString()}</p>

      <div>
        <button onClick={reset}>Reset</button>
      </div>
    </div>
  );
}
export default DateCounter;
