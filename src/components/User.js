import '../App.css';
import React, { useRef } from 'react';

const User = ({initial, save}) => {
  const inputRef = useRef();
  const handleName = (e) => {
    e.preventDefault();
    save(inputRef.current.value)
  }
  return (
    <div className="App">
      <section className="user">
        <form onSubmit={handleName}>
          <input 
            placeholder="Enter your name" 
            ref={inputRef}
            autoFocus></input>
          <button type="submit">Play Game</button>
        </form>
      </section>
    </div>);
};

export default User;