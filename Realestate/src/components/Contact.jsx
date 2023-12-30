import React, { useEffect,useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom';

const Contact = ({listing}) => {
    const [user, setUser] = useState(null);
    const [message, setMessage] = useState('');
    const onChange = (e) => {
        setMessage(e.target.value);
    };
    useEffect(() => {
        const fetchingUSer = async () => {
            axios({
                method: 'get',
                url: `/api/get-user/${listing.userRef}`
            })
            .then(res => {
                console.log(res);
                setUser(res.data);
            })
            .catch(err => {
                console.log(err);
            })
        }
        fetchingUSer();
            
    }, [])
  return (
    <>
      {user? (
        <div className='flex flex-col gap-2'>
          <p>
            Contact <span className='font-semibold'>{user.username}</span>{' '}
            for{' '}
            <span className='font-semibold'>{listing.name.toLowerCase()}</span>
          </p>
          <textarea
            name='message'
            id='message'
            rows='2'
            value={message}
            onChange={onChange}
            placeholder='Enter your message here...'
            className='w-full border p-3 rounded-lg'
          ></textarea>

          <Link
          to={`mailto:${user.email}?subject=Regarding ${listing.name}&body=${message}`}
          className='bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95'
          >
            Send Message          
          </Link>
        </div>
      ):(
        <p className='text-center'>Loading...</p>
      )}
    </>
  )
  
}

export default Contact