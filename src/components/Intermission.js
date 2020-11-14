import React from 'react';

const Intermission = ({results}) => {
  return (
    <>
      <h2>Question Results:</h2>
      <ol>
        {
          results.sort((r1, r2) => r1.duration - r2.duration).map(r => {
            return (<li key={r.user}>{`${r.user} - correct? ${r.result} - ${r.duration}ms`}</li>)
          })
        }
      </ol>
    </>
  );
};

export default Intermission;