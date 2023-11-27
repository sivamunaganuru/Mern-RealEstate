import React from 'react'
import { useSelector } from 'react-redux'
import { useState } from 'react'

const Profile = () => {
  const {currentUser,loading} = useSelector(state => state.user);
  const [userDetails, setUserDetails] = useState({
    email: currentUser.email,
    username: currentUser.username,
    password: ''
  })
  const [errors, setErrors] = useState({email: '', username: '', password: ''})

  const handleUserDetailsChange = (e) => {
    setUserDetails({...userDetails, [e.target.id]: e.target.value})
  }
  
  const handleSubmit = (e) => {
  }

  const hasErrors = () => {
    return Object.keys(errors).filter(key => key !== 'message').some(key => errors[key] !== '');
  };
  return (
    
    <div className='p-5 max-w-lg mx-auto'>
        <h1 className='text-3xl text-center font-semibold my-3'>Sign Up</h1>

        <form className='flex flex-col items-center'>
          <img src={currentUser.avatar} alt="profile" className='w-32 h-32 rounded-full object-cover cursor-pointer mt-3' />
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input 
              id='username' 
              className='border border-gray-400 w-full min-w-[20rem] p-2 rounded-lg placeholder:text-gray-400'
              type='text' 
              placeholder='Username' 
              value={userDetails.username} 
              onChange={handleUserDetailsChange}
            />
            <p className='text-red-500 text-sm'>{errors.username}</p>
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              email
            </label>
            <input 
              id='email' 
              className='border border-gray-400 w-full min-w-[20rem] p-2 rounded-lg'
              type='email' 
              placeholder='email' 
              value={userDetails.email} 
              onChange={handleUserDetailsChange}
            />
            <p className='text-red-500 text-sm'>{errors.email}</p>
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              password
            </label>
            <input 
              id='password' 
              className='border border-gray-400 w-full min-w-[20rem] p-2 rounded-lg'
              type='password' 
              placeholder='password' 
              value={userDetails.password} 
              onChange={handleUserDetailsChange}
            />
            <p className='text-red-500 text-sm'>{errors.password}</p>
          </div>

          <button className='border border-gray-400 w-80 p-2 my-2 bg-slate-700 text-white font-bold rounded-lg
          hover:opacity-90 disabled:opacity-70' onClick={handleSubmit} disabled={hasErrors() || loading}>
          {loading ? <Spinner /> : 'Update Profile'}
          </button>
        </form>

        <div className='flex justify-between justify-around mt-5'>
          <span className='text-red-500 text-sm cursor-pointer hover:underline'>Delete Account</span>
          <span className='text-red-500 text-sm cursor-pointer  hover:underline'>Sign Out</span>
        </div>

    </div>
  )
}

export default Profile