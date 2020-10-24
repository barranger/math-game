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
  console.log('about to display ' + user);
  return (
    <div className="App">
      <header className="App-header">
        <p>{`Hello ${user}`}</p>
        
      </header>
      <section className="score">
          <p>{`you're score is ${score}`}</p>
        </section>
      <section className="question">
        <Question onCorrect={() => setScore( score + 1)} />
      </section>
     
      <section className="goodbye">
        <div onClick={() => {
          localStorage.clear();
          setUser(null);
        }}>
          <p>Good Bye!!</p>
        </div>
      </section>
    </div>
  );
}

export default App;
