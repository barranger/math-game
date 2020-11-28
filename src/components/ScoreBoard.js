import React from 'react';
import '../styles/App.css';

const ScoreBoard = ({userList}) => {
  return (
    <section className="score">
      <h3>Scores</h3>
      <ol>
        {Object.keys(userList).map(u => {   
          return <li key={u}>{`${userList[u].user}: ${userList[u].score}`}</li>
        })}
      </ol>
    </section>
  );
};

export default ScoreBoard;