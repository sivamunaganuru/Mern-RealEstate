import React, { useState } from 'react';
import { FaBars } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useDispatch,useSelector } from 'react-redux';

const Navbar = () => {
  const [showMenu, setShowMenu] = useState(false);
  const {currentUser} = useSelector(state => state.user);

  const handleHamburgerClick = () => {
    setShowMenu(prevShowMenu => !prevShowMenu);
  };
{/* These items will be hidden on small screens and shown on wider screens */}
  return (
    <div className="relative">
      <ul className='flex items-center space-x-4 text-sm sm:text-base'>
        <Link to="/">
        <li className='hidden sm:inline text-slate-700 hover:underline selection:text-slate-900'>Home</li>
        </Link>
        <Link to="/about">
        <li className='hidden sm:inline text-slate-700 hover:underline selection:text-slate-900'>About</li>
        </Link>
        <Link to="/profile" className='hidden sm:inline'>
          {currentUser ?(
            <img src={currentUser.avatar} alt="profile" className='w-8 h-8 rounded-full object-cover' />
          )
          :(
          <li className=' text-slate-700 hover:underline selection:text-slate-900'>Sign In</li>
          )}
        </Link>
        {/* <Link to="/sign-up">
        <li className='hidden sm:inline text-slate-700 hover:underline selection:text-slate-900'>Sign Up</li>
        </Link> */}
      </ul>
      {/* Hamburger icon for smaller screens */}
      <div className='sm:hidden'>
      {currentUser ?(
        <Link to="/profile">
        <img src={currentUser.avatar} alt="profile" className='w-8 h-8 rounded-full object-cover' />
        </Link>
      )
      :(<>
        <FaBars onClick={handleHamburgerClick} className=' text-slate-700 cursor-pointer z-50' />
        {/* Menu for smaller screens */}
        {showMenu && (
          <ul className='absolute top-full right-0 bg-slate-200 p-3 rounded-lg flex flex-col space-y-2 sm:hidden w-auto min-w-[100px]'>
          <Link to="/">
          <li className='text-slate-700 hover:underline selection:text-slate-900 block' onClick={handleHamburgerClick} >Home</li>
          </Link>
          <Link to="/about">
          <li className='text-slate-700 hover:underline selection:text-slate-900 block' onClick={handleHamburgerClick} >About</li>
          </Link>
          <Link to="/sign-in">
          <li className='text-slate-700 hover:underline selection:text-slate-900 block' onClick={handleHamburgerClick}>Sign In</li>
          </Link>
          {/* <Link to="/sign-up">
          <li className='text-slate-700 hover:underline selection:text-slate-900 block'>Sign Up</li>
          </Link> */}
        </ul>
      )}
      </>
      )}
      </div>
    </div>
  );
};

export default Navbar;
