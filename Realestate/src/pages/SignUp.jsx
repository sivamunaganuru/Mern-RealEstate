import React from 'react';
import { Link } from 'react-router-dom';
import { useState,useEffect } from 'react';
import axios from 'axios';
import { object, string,ref } from 'yup';
import { useNavigate } from 'react-router-dom';
import Spinner from '../components/Spinner';
import OAuth from '../components/OAuth';
import { useDispatch,useSelector } from 'react-redux';
import { signInFailure,signInRequest,validationFailure } from '../redux/userSlice';

const formValidation = object({
  username: string().required('Username is required'),
  email: string().email().required('Email is required'),
  password: string().required('Password is required').min(8, 'Password must be at least 8 characters'),
  confirmPassword: string().required('Confirm Password is required')
  .oneOf([ref('password'), null], 'Passwords must match')
})


const SignUp = () => {

  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const [errors, setErrors] = useState({});//{username: 'Username is required', email: 'Email is required'}
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const {loading, apierror} = useSelector(state => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if(loading || apierror){
        dispatch(validationFailure());
    }
  }
  ,[]);

  const handleFormChange = (e) => {
    const key = e.target.id;
    const value = e.target.value;
    const updatedForm = { ...form, [key]: value };
    setForm(updatedForm);

    // Validate the field immediately after change
    formValidation.validateAt(key, updatedForm)
    .then(() => {
      // If field is valid, clear errors for this field
      setErrors({ ...errors, [key]: '' });
    })
    .catch(err => {
      // Show error message for this field
      setErrors({ ...errors, [key]: err.errors[0] });
    });
  }

  // Function to check if there are any errors
  const hasErrors = () => {
    return Object.values(errors).some(err => err !== '');
  };
 

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(signInRequest());
    formValidation.validate(form,{abortEarly:false}).then(() => {

      axios({
        method : 'POST',
        url: '/api/signup',
        data: {
          username: form.username,
          email: form.email,
          password: form.password
        }
        }).then((res) => {
          setErrors({});//{username: 'Username is required', email: 'Email is required'}
          setForm({
            username: '',
            email: '',
            password: '',
            confirmPassword: ''
          })
          dispatch(validationFailure());
          setTimeout((navigate('/sign-in')), 2000);
        }).catch((err) => {
          
          // console.log(err.response.data);
          // setErrors({message: err.response.data.message});
          dispatch(signInFailure(err.response.data.message || 'Something went wrong'));
        })
    }
    ).catch((err) => {
      // console.log(err.inner);
      const errors = err.inner;
      const errorsObj = {};
      errors.map((error) => {
        errorsObj[error.path] = error.message;
      })
      setErrors(errorsObj);
      dispatch(validationFailure());
    })

    
  }

  return (
    <div className='p-5 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-3'>Sign Up</h1>

      <form className='flex flex-col items-center'>
        
        <div className="mb-4">
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">
            Username
          </label>
          <input 
            id='username' 
            className='border border-gray-400 w-full min-w-[20rem] p-2 rounded-lg'
            type='text' 
            placeholder='Username' 
            value={form.username} 
            onChange={handleFormChange}
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
            value={form.email} 
            onChange={handleFormChange}
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
            value={form.password} 
            onChange={handleFormChange}
          />
          <p className='text-red-500 text-sm'>{errors.password}</p>
        </div>

        <div className="mb-4">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
            confirmPassword
          </label>
          <input 
            id='confirmPassword' 
            className='border border-gray-400 w-full min-w-[20rem] p-2 rounded-lg'
            type='password' 
            placeholder='confirmPassword' 
            value={form.confirmPassword} 
            onChange={handleFormChange}
          />
          <p className='text-red-500 text-sm'>{errors.confirmPassword}</p>
        </div>
  
        <button className='border border-gray-400 w-80 p-2 my-2 bg-slate-700 text-white font-bold rounded-lg
        hover:opacity-90 disabled:opacity-70' onClick={handleSubmit} disabled={hasErrors() || loading}>
        {loading ? <Spinner /> : 'Sign Up'}
        </button>
        <p className='text-red-500 text-sm'>{apierror}</p>
        <OAuth />
      </form>

      <div className='flex justify-center gap-2 mt-3'>
        <p>Already have an account?</p>
        <Link to='/sign-in' className='text-blue-500'>Sign In</Link>
        
      </div>
    </div>
  )
}


export default SignUp