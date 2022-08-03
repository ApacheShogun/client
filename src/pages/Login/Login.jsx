import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from '../../hooks/useAuthContext'
import './Login.css'

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isError, setIsError] = useState(null)
  const [isLoading, setIsLoading] = useState(null)
  const { dispatch } = useAuthContext()
  const navigate = useNavigate()


  const handleLogin = () => {
    const data = { email, password };
    setIsLoading(true)
    setIsError(null)

    axios.post('http://localhost:4000/api/user/login', data).then(res => {
         setIsLoading(false)
         localStorage.setItem('user', JSON.stringify(res.data))
         dispatch({type: 'LOGIN', payload: res.data})
         navigate('/')
         console.log(res.data);

    }).catch(error => {
      if(error.response){
        console.log(error.response.data.error);
        setIsError(error.response.data.error)
        setIsLoading(false)
      }
    })
  };

  return (
    <div className="login-page">
      <div className="signupform">
        <h1 className="login-title">Login to continue the journey</h1>
        {isError && <p className='form-error'>{isError}</p>}
        <input
          value={email}
          id="createUsername"
          onChange={(e) => setEmail(e.target.value)}
          name="email"
          placeholder="email"
        />
        <input
          value={password}
          id="passwordman"
          onChange={(e) => setPassword(e.target.value)}
          name="username"
          type="password"
          placeholder="password"
        />
        <button className="loginBtn" disabled={isLoading} onClick={handleLogin} >
          Login
        </button>

        <h3>New to space? launch into orbit by <Link to='/signup'>Signing Up</Link></h3>
      </div>
    </div>
  );
};

export default Login;