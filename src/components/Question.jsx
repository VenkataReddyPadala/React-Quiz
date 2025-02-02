import { useData } from "../context/QuizContext";
import Options from "./Options";

function Question() {
  const { filteredQuestions, questions, index } = useData();
  const question = filteredQuestions[index] || questions[index];

  return (
    <div>
      <h4>{question.question}</h4>
      <Options question={question} />
    </div>
  );
}

export default Question;
