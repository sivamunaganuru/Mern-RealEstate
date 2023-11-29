import React from 'react';
import { Link } from 'react-router-dom';
import { useState,useEffect } from 'react';
import axios from 'axios';
import { object, string,ref } from 'yup';
import { useNavigate } from 'react-router-dom';
import Spinner from '../components/Spinner';
import { useDispatch,useSelector } from 'react-redux';
import { signInSuccess,signInFailure,signInRequest,validationFailure,clearOldMessages } from '../redux/userSlice';
import OAuth from '../components/OAuth';
import { toast } from 'react-toastify';

const credentialsValidation = object({
  email: string().email().required('Email is required'),
  password: string().required('Password is required').min(8, 'Password must be at least 8 characters')
})

const SignIn = () => {

  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState({});//{username: 'Username is required', email: 'Email is required'}
  const {loading, apierror} = useSelector(state => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    clearOldMessages();
  },[]);

  const handleCredentialsChange = (e) => {
          const key = e.target.id;
          const value = e.target.value;
          const updatedcredentials = { ...credentials, [key]: value };
          setCredentials(updatedcredentials);

          // Validate the field immediately after change
          credentialsValidation.validateAt(key, updatedcredentials )
          .then(() => {
            // If field is valid, clear errors for this field
            setErrors({ ...errors, [key]: '' });
          })
          .catch(err => {
            // Show error message for this field
            setErrors({ ...errors, [key]: err.errors[0] });
          });
        }

  const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(signInRequest());
        credentialsValidation.validate(credentials,{abortEarly:false}).then(() => {
          axios({
            method : 'POST',
            url: '/api/signin',
            data: {
              email: credentials.email,
              password: credentials.password
            }
            }).then((res) => {
              setErrors({});
              setCredentials({
                email: '',
                password: '',
              })
              // console.log(res.data);
              // localStorage.setItem('token', res.data.token);
              dispatch(signInSuccess(res.data));
              navigate('/profile');
            }).catch((err) => {
              console.log(err.response.data);
              // setErrors({message: err.response.data.message});
              dispatch(signInFailure(err.response.data.message));
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

  const hasErrors = () => {
        return Object.keys(errors).filter(key => key !== 'message').some(key => errors[key] !== '');
  };

  useEffect(() => {
    if (apierror) {
      toast.error(apierror, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  }, [apierror]); // This effect will run when apierror changes

  return (

      <div className='p-5 max-w-lg mx-auto'>
        <h1 className='text-3xl text-center font-semibold my-3'>Sign In</h1>

        <form className='flex flex-col items-center'>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              email
            </label>
            <input 
              id='email' 
              className='border border-gray-400 w-full min-w-[20rem] p-2 rounded-lg'
              type='email' 
              placeholder='email' 
              value={credentials.email} 
              onChange={handleCredentialsChange}
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
              value={credentials.password} 
              onChange={handleCredentialsChange}
            />
            <p className='text-red-500 text-sm'>{errors.password}</p>
          </div>

          <button className='border border-gray-400 w-80 p-2 my-2 bg-slate-700 text-white font-bold rounded-lg
          hover:opacity-90 disabled:opacity-70' onClick={handleSubmit} disabled={hasErrors() || loading}>
          {loading ? <Spinner /> : 'Sign In'}
          </button>
          <OAuth />
          {/* <p className='text-red-500 text-sm'>{apierror}</p> */}
        </form>
        <div className='flex justify-center gap-2 mt-3'>
          <p>Don't have an account?</p>
          <Link to='/sign-up' className='text-blue-500'>Sign Up</Link>
        </div>
      </div>

     
  )
}

export default SignIn;