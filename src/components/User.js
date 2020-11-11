import '../App.css';
import '../styles/user.css';
import React, { useRef } from 'react';
import { post } from '../util/restUtil';

const User = ({initial, save}) => {
  const inputRef = useRef();
  const handleName = async (e) => {
    e.preventDefault();
    const holder = document.getElementById('user-form-holder');
    holder.classList.add('loading');
    inputRef.current.blur();

    const user = inputRef.current.value;
    const regResponse = await post(`/register`, { user });
    if(regResponse.errorCode) {
      document.getElementById('msg').innerText = `username ${user} is already taken, please try again.`;
      setTimeout( () => {
        holder.classList.remove('loading');
        inputRef.current.focus();
      }, 2000);
    }
    else {
      save({ user, ...regResponse });
    }
    
  }
  return (
    <div id="user-form-holder">
      <div  id="user-form"  className="App">
        <section className="user">
          <form onSubmit={handleName}>
            <input 
              placeholder="Enter your name" 
              ref={inputRef}
              autoFocus></input>
            <button type="submit">Play Game</button>
          </form>
        </section>
      </div>
      <div  id="user-form-back"  className="App">
        <section className="user">
          <h2 id="msg">Loading...</h2>
        </section>
      </div>
    </div>);
};

export default User;