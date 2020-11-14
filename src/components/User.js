import '../styles/App.css';
import '../styles/user.css';
import React, { useRef } from 'react';
import { post } from '../util/restUtil';

const User = ({save}) => {
  const inputRef = useRef();
  const handleName = async (e) => {
    e.preventDefault();
    const holder = document.getElementById('user-form-holder');
    holder.classList.add('loading');
    inputRef.current.blur();

    const user = inputRef.current.value;
    const regResponse = await post(`/register`, { user });

    const handleError = (errorMsg) => {
      document.getElementById('msg').innerText = errorMsg;
      setTimeout( () => {
        holder.classList.remove('loading');
        inputRef.current.focus();
      }, 3000);
    }

    if(regResponse.errorCode === 409 ) {
      handleError(`Username ${user} is already taken, please try again.`);
    }
    else if (regResponse.errorCode === 400 ) {
      handleError('You must provide an user name');
    }
    else {
      save({ user, ...regResponse });
    }
    
  }
  return (
    <div id="user-form-holder">
      <div  id="user-form"  className="App app-circle">
        <section className="user">
          <form onSubmit={handleName}>
            <label>
              <h3>Name</h3>
              <input 
                placeholder="Enter your name" 
                ref={inputRef}
                autoFocus></input>
              </label>
            <button type="submit">Play Game</button>
          </form>
        </section>
      </div>
      <div id="user-form-back"  className="App  app-circle">
        <section className="user">
          <h2 id="msg">Loading...</h2>
        </section>
      </div>
    </div>);
};

export default User;