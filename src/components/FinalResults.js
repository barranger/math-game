import React from 'react';
import '../styles/results.css'

const FinalResults = ({results, user}) => {
  if(!results) {
    return null;
  }

  return (
  <>
    <div className="results">
      <span>{`You placed ${results.findIndex((r)=> r.user === user) + 1} out of ${results.length}`}</span>
      <ul>
          {
            results.map(r => {
              console.log('user ', r);
              return (<li key={r.user}>{`${r.score}pts - ${r.user}`}</li>)
            })
          }
      </ul>
      </div>
  </>
  );
};

export default FinalResults;