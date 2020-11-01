import './App.css';
import { useEffect, useState } from 'react';
import User from './components/User';
import Question from './components/Question';
import * as io from 'socket.io-client';

const App = () => {
  const [user, setUser] = useState('');
  const [score, setScore] = useState(0);
  const [socket, setSocket] = useState(null);
  const [userList, setUserList] = useState({});

  useEffect(() => {
    if(!socket && user) {
      const sock = io();
      sock.on('user list', (ul) => {
        console.log('got back a userList', userList);
        setUserList(ul);
      });
      setSocket(sock);
    }
  }, [socket, user, userList]);

  if(!user) {
    return <User initial={user} save={(u) => {
      setUser(u);
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
            return <li>{`${userList[u].user}: ${userList[u].score}`}</li>
          })}
        </ol>
        </section>
      <section className="question">
        <Question onCorrect={
          () => {
            setScore( score + 1);
            if(socket) {
              socket.emit('correct answer', { user, score: score + 1 })
            }
          }
        } />
      </section>
     
      <section className="goodbye">
        <div onClick={() => {
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
