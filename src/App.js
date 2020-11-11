import './App.css';
import { useEffect, useState } from 'react';
import User from './components/User';
import Question from './components/Question';
import * as io from 'socket.io-client';

const App = () => {
  const [user, setUser] = useState(null);
  const [socket, setSocket] = useState(null);
  const [question, setQuestion] = useState(null)
  const [result, setResult] = useState(null);
  const [finalResults, setFinalResults] = useState(null);
  const [userList, setUserList] = useState({});

  useEffect(() => {
    const setup = async () => {
      const sock = io();

      sock.on('user list', (ul) => { setUserList(ul); });
      sock.on('question', (q) => { 
        setQuestion(q); 
        setResult(null);
        setFinalResults(null);
      });
      sock.on('answer result', (result) => {
        setQuestion(null);
        setResult(result);
      });
      sock.on('quiz over', (ul) => setFinalResults(ul));

      setSocket(sock);
    }
      
    if (!socket && user) {
      setup();
    }
  }, [socket, user, userList]);

  if(!user) {
    return <User initial={user} save={(u) => {

      setUserList(u.scores);
      setQuestion(u.currentQuestion);
      setUser(u.user);
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
          {Object.keys(userList).map(u => {   
            return <li key={u}>{`${userList[u].user}: ${userList[u].score}`}</li>
          })}
        </ol>
        </section>
      <section className="question">
        {!finalResults && !result && question && <Question 
          question={question}
          onAnswer={(answer) => socket.emit('answer', { answer, user })} 
        />}
        {result && !finalResults && (
          <>
          <h2>Your answer is</h2>
          <div className="question"><span>{result}</span></div>
          </>
        )}
        {!question && !result && !finalResults && <h2>Quiz is Loading...</h2>}
        {finalResults && (
          <>
          <h2>Final Results:</h2>
          <div className="question"><span>{`You placed ${finalResults.findIndex((r)=> r.user === user) + 1} out of ${finalResults.length}`}</span></div>
          </>
        )}
      </section>
     
      <section className="goodbye">
        <div onClick={() => {
          setUser(null);
        }}>
          <p>Good Bye!!</p>
        </div>
      </section>
    </div>
    </>
  );
}

export default App;
