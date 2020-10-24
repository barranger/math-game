import React, { useRef, useState } from 'react';

const Question = ({onCorrect}) => {
  const [question, setQuestion] = useState(null);
  const inputRef = useRef();
  const feedbackRef = useRef();
  const operations = [ '+', '-', '/', '*'];


  const loadQuestion = () => {   
    const q = {};
    while(!Number.isInteger(q.answer)) {
      
      q.left = Math.round(Math.random() * 9);
      q.right = Math.round(Math.random() * 9);
      q.operation = operations[Math.round(Math.random() * 3)];
      // eslint-disable-next-line no-eval
      q.answer = eval(`${q.left}${q.operation}${q.right}`);
    };
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
      feedbackRef.current.innerText = "Correct";
      onCorrect();
    } else {
      feedbackRef.current.innerText = "Wrong";
    }

    feedbackRef.current.classList.remove('hidden');
    setTimeout(() => {
      feedbackRef.current.classList.add('hidden');
    }, 1000)
    inputRef.current.value = '';
    setQuestion(null);

  }

  return (
    <form onSubmit={handleAnswer}>
      <h2>Answer the Following Question:</h2>
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
      <h3 className="hidden feedback" ref={feedbackRef}>Correct</h3>
    </form>
  );
};

export default Question;