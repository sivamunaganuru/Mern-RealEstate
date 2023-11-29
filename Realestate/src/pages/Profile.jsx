import React from 'react'
import { useSelector,useDispatch } from 'react-redux'
import { useState,useRef,useEffect } from 'react'
import Spinner from '../components/Spinner'
import {profileUpdatefailure, signOut,profileUpdateSucess, profileUpdateRequest,clearOldMessages} from '../redux/userSlice'
import {useNavigate} from 'react-router-dom'
import axios from 'axios'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import app from '../firebase';
import useErrorToastify from '../customHooks/errorToastify.js';
import useSuccessToastify from '../customHooks/successToastify.js';
import { Link } from 'react-router-dom'

const Profile = () => {
  const {currentUser,loading} = useSelector(state => state.user);
  const [userDetails, setUserDetails] = useState({
    email: currentUser.email,
    username: currentUser.username,
    password: '',
    avatar: currentUser.avatar
  });
  const [errors, setErrors] = useState({email: '', username: '', password: ''});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [uploadStatus, setUploadStatus] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(null);

  

  useEffect(() => {
    dispatch(clearOldMessages());
    setErrors({email: '', username: '', password: ''});
  },[]);

  useErrorToastify();
  useSuccessToastify();

  const handleUserDetailsChange = (e) => {
    setUserDetails({...userDetails, [e.target.id]: e.target.value})
  }
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate the field immediately after change
    if(userDetails.username === currentUser.username && userDetails.email === currentUser.email && userDetails.password === '' && userDetails.avatar === currentUser.avatar){
      setErrors({email: 'No changes made', username: 'No changes made', password: 'No changes made'});
    }else{
      dispatch(profileUpdateRequest());
      setErrors({email: '', username: '', password: ''});
      axios({
        method: 'PUT',
        url: '/api/update-profile',
        data: {
          id: currentUser._id,
          username: userDetails.username,
          email: userDetails.email,
          password: userDetails.password,
          avatar: userDetails.avatar
        }
        
      }).then((res) => {
        console.log(res.data);
        dispatch(profileUpdateSucess(res.data));
      }).catch((err) => {
        console.log(err.response.data);
        dispatch(profileUpdatefailure(err.response.data.message || 'Unable to Update Profile,Try Again'));
      })
        
    }
  }

  const handleSignOut = () => {
    try{
      axios({
        method: 'GET',
        url: '/api/signout',
      }).then((res) => {
        console.log(res.data);
        dispatch(signOut());
        // console.log('Signed Out and Redirecting to Home Page');
        // console.log(currentUser);
        // navigate('/');
      })
    }
    catch(err){
      dispatch(profileUpdatefailure(err.response.data.message || 'Unable to Sign Out,Try Again'));
    }
  }
  const handleDelete = () => {
    if(window.confirm('Are you sure you want to delete your account?')){
      // Delete account
      axios({
        method: 'DELETE',
        url: `/api/delete-account/${currentUser._id}`,
        
      }).then((res) => {
        console.log(res.data);
        dispatch(signOut());
        // navigate('/');
      }).catch((err) => {
        console.log(err.response.data);
        dispatch(profileUpdatefailure(err.response.data.message || 'Unable to Delete Account,Try Again'));
      })
    }
  }

  const handleFileupload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + '-' + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed',
      (snapshot) => {
        // progress function
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadStatus(progress);
        console.log('Upload is ' + progress + '% done');
      }
      ,(error) => {
        // error function
        setFileUploadError(error.message);
      }
      ,() => {
        // complete function
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log('File available at', downloadURL);
          setUserDetails({...userDetails, avatar: downloadURL});
        });
      }
    );
    };

  useEffect(() => {
    if(file){
      handleFileupload(file);
    }
  }
  ,[file]);


  const uploadingFile = () => {
    if(uploadStatus>0 && uploadStatus<100){
      return true;
    }
    return false;
  }

  return (
    
    <div className='p-5 max-w-lg mx-auto'>
        <h1 className='text-3xl text-center font-semibold my-3'>Profile</h1>

        <form className='flex flex-col items-center'>
          <input type="file" className='hidden' ref={fileRef} accept='image/*' 
            onChange={(e)=>setFile(e.target.files[0])}/>
          <img src={userDetails.avatar} onClick={()=>fileRef.current.click()}
           alt="profile" className='w-32 h-32 rounded-full object-cover cursor-pointer mt-3' />
           {uploadingFile() &&(<progress value={uploadStatus} max="100" className='w-32 h-1 mt-2'></progress>)}
            {uploadStatus===100 &&(<p className='text-green-500 text-sm'>File Uploaded Successfully</p>)}
            {fileUploadError && (<p className='text-red-500 text-sm'>{fileUploadError}</p>)}
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
          hover:opacity-90 disabled:opacity-70' onClick={handleSubmit} disabled={loading || uploadingFile()}>
          {loading ? <Spinner /> : 'Update Profile'}
          </button>
          {/* <p className='text-red-500 text-sm'>{apierror}</p> */}
          {/* <p className='text-green-500 text-sm'>{successMessages}</p> */}
          <Link to='/create-listing'>
          <button className='border border-gray-400 w-80 p-2 my-2 bg-green-700 text-white font-bold rounded-lg
          uppercase hover:opacity-90 disabled:opacity-70' disabled={loading || uploadingFile()}>
          create Listing </button>
          </Link>
          
        </form>

        <div className='flex justify-around mt-5'>
          <span className='text-red-500 text-sm cursor-pointer hover:underline' onClick={handleDelete}>Delete Account</span>
          <span className='text-red-500 text-sm cursor-pointer  hover:underline' onClick={handleSignOut}>Sign Out</span>
        </div>

    </div>
  )
}

export default Profile