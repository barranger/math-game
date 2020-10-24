import '../App.css';
import React, { useRef } from 'react';

const User = ({initial, save}) => {
  const inputRef = useRef();
  return (
    <div className="App">
      <header className="App-header">
        <form onSubmit={() => save(inputRef.current.value)}>
      <input placeholder="Enter your name" ref={inputRef}></input>
      <button type="submit">Submit</button>
      </form>
    </header>
    </div>);
};

export default User;