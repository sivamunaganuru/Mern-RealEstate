import React from 'react';
import { Link } from 'react-router-dom';
import { useState } from 'react';


const SignIn = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  })
  const handleCredentialsChange = (e) => {
    const key = e.target.id;
    const value = e.target.value;
    setCredentials({...credentials, [key]: value})
  }
  const handleSubmit = (e) => {
    e.preventDefault();
  }

  return (
    <div>
      <h1 className='text-3xl text-center font-semibold my-3'>Sign In</h1>
      <form className='flex flex-col items-center'>
        <input className='border border-gray-400 w-80 p-2 my-2 rounded-lg'
         id='email' type='email' placeholder='Email' value={credentials.email} onChange={handleCredentialsChange}/>
        <input className='border border-gray-400 w-80 p-2 my-2 rounded-lg'
         id='password' type='password' placeholder='Password'value={credentials.password} onChange={handleCredentialsChange}/>
        <button className='border border-gray-400 w-80 p-2 my-2 bg-slate-700 text-white font-bold rounded-lg
        hover:opacity-90 disabled:opacity-70' onClick={handleSubmit}>Sign In</button>
      </form>
      <div className='flex justify-center gap-2 mt-3'>
        <p>Don't have an account?</p>
        <Link to='/sign-up' className='text-blue-500'>Sign Up</Link>
      </div>
    </div>
  )
}

export default SignIn;