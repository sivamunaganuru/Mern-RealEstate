import React from 'react';
import {FaSearch} from 'react-icons/fa';
import { FaHamburger } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import Navbar from './Navbar';

const Header = () => {

    const [showMenu, setShowMenu] = useState(false);
    const toggleMenu = () => {
        setShowMenu(!showMenu);
      };

  return (
    <header className='bg-slate-200 shadow-md '>
        {/* make the font bold, And responsive sizes */} 
        <div className='flex items-center py-2 px-5 justify-between max-w-6xl mx-auto'>
        <Link to="/">
        <h1 className=" font-serif font-bold text-sm sm:text-2xl flex flex-wrap ">
            <span className=" text-orange-700">My</span>
            <span className=" text-orange-800">Estate</span>
        </h1>
        </Link>
       
        <form className='bg-slate-100 p-3 rounded-lg flex items-center '>
            <input type="text" placeholder="Search..." className="bg-transparent focus:outline-none w-30 sm:w-48 md:w-72 " />
            <FaSearch className='text-slate-700'/>
        </form>

        {/* Navigation links */}
        <Navbar />
        
        </div>
        
    </header>
  )
}

export default Header