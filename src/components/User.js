import '../App.css';
import React, { useRef } from 'react';

const User = ({initial, save}) => {
  const inputRef = useRef();
  return (
    <div className="App">
      <section className="user">
        <form onSubmit={() => save(inputRef.current.value)}>
      <input placeholder="Enter your name" ref={inputRef}></input>
      <button type="submit">Submit</button>
      </form>
    </section>
    </div>);
};

export default User;