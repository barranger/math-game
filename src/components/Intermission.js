import React from 'react';

const responseSort = (r1, r2) => {
  if(r1.result !== r2.result) {
    return r1.result ? -1 : 1;
  }

  return r1.duration - r2.duration;
}

const Intermission = ({results}) => {
  return (
    <>
      <h2>Question Results:</h2>
      <ol>
        {
          results.sort(responseSort ).map(r => {
            return (<li key={r.user} className={r.result ? 'correct' : 'incorrect'}>{`${r.user} - ${r.duration}ms`}</li>)
          })
        }
      </ol>
    </>
  );
};

export default Intermission;