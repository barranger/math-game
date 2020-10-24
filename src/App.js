import './App.css';
import { useState } from 'react';
import User from './components/User';
import Question from './components/Question';

const App = () => {
  const [user, setUser] = useState(localStorage.getItem('math-name'));
  const [score, setScore] = useState(0);

  if(!user) {
    return <User initial={user} save={(u) => {
      setUser(u);
      localStorage.setItem('math-name', u);
    }} />
  }
  
  return (
    <>
    <div className="bg">
      <div className="bg-circle-orange"></div>
      <div className="bg-circle-red"></div>
      <div className="bg-circle-yellow"></div>
    </div>
    <div className="App">
      <header className="App-header">
        <p>{`Math Game`}</p>
      </header>
      <section className="score">
        <h3>Scores</h3>
        <ol>
          <li>{`${user}: ${score}`}</li>
        </ol>
        </section>
      <section className="question">
        <Question onCorrect={() => setScore( score + 1)} />
      </section>
     
      <section className="goodbye">
        <div onClick={() => {
          localStorage.clear();
          setUser(null);
          setScore(0);
        }}>
          <p>Good Bye!!</p>
        </div>
      </section>
    </div>
    </>
  );
}

export default App;
