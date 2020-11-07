import React, { useRef } from 'react';

const Question = ({onAnswer, question}) => {
  const inputRef = useRef();

  const handleAnswer = (e) => {
    e.preventDefault(); 
    const answer = inputRef.current.value;
    onAnswer(answer);
    inputRef.current.value = '';
  }

  return (
    <form onSubmit={handleAnswer}>
      <h2>{`Answer ${question.title}:`}</h2>
      <div className="question">
        <span>{question.left}</span>
        <span>{question.operation}</span>
        <span>{question.right}</span>
        <span>=</span>
        <span>
          <input 
            ref={inputRef}
            onBlur={() => inputRef.current.focus()} 
            autoFocus
          />
        </span>
      </div>
    </form>
  );
};

export default Question;