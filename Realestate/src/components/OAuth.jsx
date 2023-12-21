import React from 'react'
// Import the functions you need from the SDKs you need
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import app from '../firebase';
import axios from 'axios'; 
import { useDispatch,useSelector } from 'react-redux';
import { signInSuccess,signInRequest,validationFailure,signInFailure } from '../redux/userSlice';
import Spinner from './Spinner';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const OAuth = () => {
    const dispatch = useDispatch();
    const {loading, apierror} = useSelector(state => state.user);
    const navigate = useNavigate();

    useEffect(() => {
        if(loading || apierror){
            dispatch(validationFailure());
        }
    }
    ,[]);

    const  handleGoogleClick = async () => {  
        dispatch(signInRequest());
        try {
        const provider = new GoogleAuthProvider();
        const auth = getAuth(app);
        const result = await signInWithPopup(auth, provider);
        const user = {username: result.user.displayName, email: result.user.email, photo: result.user.photoURL}
        console.log(user);
        axios({
            method : 'POST',
            url: '/api/google',
            data: {
            username: user.username,
            email: user.email,
            photo: user.photo
            }
            }).then((res) => {
            console.log(res.data);
            dispatch(signInSuccess(res.data));
            navigate('/profile');
            }).catch((err) => {
                console.log(err.response.data);
                // setErrors({message: err.response.data.message});
                dispatch(signInFailure(err.response.data.message || 'Something went wrong'));
            })

        } catch (error) {
        console.log(error);
        dispatch(validationFailure());
        }

    }
    return (
        <button type="button" className="border border-gray-400 w-80 p-2 my-2 bg-red-700
        text-white font-bold rounded-lg uppercase hover:opacity-90 disabled:opacity-70"
        onClick={handleGoogleClick}  disabled={loading}>
        {loading ? <Spinner /> : 'Continue with Google'}
        </button>
    )
}

export default OAuth