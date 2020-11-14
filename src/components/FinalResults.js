import React from 'react';

const FinalResults = ({results, user}) => {
  if(!results) {
    return null;
  }

  return (
  <>
    <h2>Final Results:</h2>
    <div className="question"><span>{`You placed ${results.findIndex((r)=> r.user === user) + 1} out of ${results.length}`}</span></div>
  </>
  );
};

export default FinalResults;