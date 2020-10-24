import './App.css';
import { useState } from 'react';
import User from './components/User';
import Question from './components/Question';

const App = () => {
  const [user, setUser] = useState('Barranger');
  const [score, setScore] = useState(0);

  if(!user) {
    return <User initial={user} save={setUser} />
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
     
    </div>
  );
}

export default App;
