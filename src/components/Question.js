import React, { useRef, useState } from 'react';

const Question = ({onCorrect}) => {
  const [question, setQuestion] = useState(null);
  const inputRef = useRef();

  const operations = [ '+', '-', '/', '*'];

  const loadQuestion = () => {   
    const q = {
      left: Math.round(Math.random() * 9),
      right: Math.round(Math.random() * 9),
      operation: operations[Math.round(Math.random() * 3)],
    };

    // eslint-disable-next-line no-eval
    q.answer = eval(`${q.left}${q.operation}${q.right}`);

    console.log(q);
    setQuestion(q);
  }

  if(!question) {
    loadQuestion();
    return <p>Loading.....</p>;
  }

  const handleAnswer = (e) => {
    e.preventDefault(); 

    const answer = inputRef.current.value;

    if(answer === `${question.answer}`) {
      onCorrect();
    } else {
      console.log('wrong!!!!');
    }
    inputRef.current.value = '';
    setQuestion(null);

  }

  return (
    <form onSubmit={handleAnswer}>
      <div className="question">
        <span>{question.left}</span>
        <span>{question.operation}</span>
        <span>{question.right}</span>
        <span>=</span>
        <span><input ref={inputRef} /></span>
      </div>
    </form>
  );
};

export default Question;