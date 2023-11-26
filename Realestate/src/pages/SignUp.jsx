import React from 'react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';

const SignUp = () => {

  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const handleFormChange = (e) => {
    const key = e.target.id;
    const value = e.target.value;
    setForm({...form, [key]: value})
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    axios({
      method : 'POST',
      url: '/api/signup',
      data: {
        username: form.username,
        email: form.email,
        password: form.password
      }
    }).then((res) => {
      console.log(res.data);
    }).catch((err) => {
      console.log(err);
    })
  }

  return (
    <div className='p-5 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-3'>Sign Up</h1>

      <form className='flex flex-col items-center'>
        <input id='username' className='border border-gray-400 w-80 p-2 my-2 rounded-lg'
         type='text' placeholder='Username' value={form.username} onChange={handleFormChange}/>
        <input id='email' className='border border-gray-400 w-80 p-2 my-2 rounded-lg'
         type='email' placeholder='Email' value={form.email} onChange={handleFormChange}/>
        <input id='password' className='border border-gray-400 w-80 p-2 my-2 rounded-lg'
         type='password' placeholder='Password' value={form.password} onChange={handleFormChange}/>
        <input id='confirmPassword' className='border border-gray-400 w-80 p-2 my-2 rounded-lg'
         type='password' placeholder='Confirm Password' value={form.confirmPassword} onChange={handleFormChange}/>
        <button className='border border-gray-400 w-80 p-2 my-2 bg-slate-700 text-white font-bold rounded-lg
        hover:opacity-90 disabled:opacity-70' onClick={handleSubmit}>Sign Up</button>
      </form>

      <div className='flex justify-center gap-2 mt-3'>
        <p>Already have an account?</p>
        <Link to='/sign-in' className='text-blue-500'>Sign In</Link>
        
      </div>
    </div>
  )
}

export default SignUp