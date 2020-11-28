import './styles/App.css';
import { useEffect, useState } from 'react';
import User from './components/User';
import Question from './components/Question';
import * as io from 'socket.io-client';
import Intermission from './components/Intermission';
import FinalResults from './components/FinalResults';
import ScoreBoard from './components/ScoreBoard';

const App = () => {
  const [user, setUser] = useState(null);
  const [socket, setSocket] = useState(null);
  const [scene, setScene ] = useState(null);
  const [question, setQuestion] = useState(null)
  const [result, setResult] = useState(null);
  const [finalResults, setFinalResults] = useState(null);
  const [questionResults, setQuestionResults] = useState([]);
  const [userList, setUserList] = useState({});

  useEffect(() => {
    const setup = async () => {
      const sock = io();

      sock.on('user list', (ul) => { setUserList(ul); });
      sock.on('scene change', (msg) => { 
        setScene(msg.scene);
      });
      sock.on('question', (q) => { 
        setQuestion(q); 
        setQuestionResults([]);
        setResult(null);
        setFinalResults(null);
        setScene('question');
      });
      sock.on('answer result', (result) => {
        setScene('answered');
        setQuestion(null);
        setResult(result);
      });
      sock.on('user answer', (msg) => { 
        setQuestionResults((res) => [...res, msg]);
      })
      sock.on('quiz over', (ul) => {
        setFinalResults(ul);
        setScene('final results');
      });
      setSocket(sock);
    }
      
    if (!socket && user) {
      setup();
    }
  }, [socket, user, userList, questionResults]);

  if(!user) {
    return <User initial={user} save={(u) => {
      setUserList(u.scores);
      setQuestion(u.currentQuestion);
      setUser(u.user);
    }} />
  }

  // console.log('we are displaying the scene', scene);
  // console.log('the question results are: ', questionResults);

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
      <section className="question">
        {!scene && <h2>Quiz is Loading...</h2> }
        {scene === 'question' && <Question 
          question={question}
          onAnswer={(answer) => socket.emit('answer', { answer, user })} 
        />}
        {scene === 'answered' && (
          <>
          <h2>Your answer is</h2>
          <div className="question"><span>{result}</span></div>
          </>
        )}
        {scene === 'intermission' && <Intermission results={questionResults} />} 
        {scene === 'final results' && <FinalResults user={user} results={finalResults} />}
      </section>
     
      <section className="goodbye">
        <div onClick={() => {
          setUser(null);
        }}>
          <p>Good Bye!!</p>
        </div>
      </section>
    </div>
    <ScoreBoard userList={userList} />
    </>
  );
}

export default App;
