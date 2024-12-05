import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Navbar = () => {
  const { logout, user } = useAuth0();
  const [nav, setNav] = useState(false);

  const links = [
    {
      id: 1,
      link: '/',
      text: 'Home'
    },
    {
      id: 2,
      link: '/comments',
      text: 'Comments'
    }
  ];

  const handleLogout = () => {
    logout({
      logoutParams: {
        returnTo: window.location.origin + '/#/signin'
      }
    });
    toast.success('Logged out successfully!');
  };

  return (
    <div className="flex justify-between items-center w-full h-20 px-4 text-white bg-black fixed nav">
      <div>
        <h1 className="text-5xl font-signature ml-2">
          <Link to="/" className="link-underline">
            News Explorer
          </Link>
        </h1>
      </div>

      <ul className="hidden md:flex">
        {links.map(({ id, link, text }) => (
          <li
            key={id}
            className="nav-links px-4 cursor-pointer capitalize font-medium text-gray-500 hover:scale-105 hover:text-white duration-200 link-underline"
          >
            <Link to={link}>{text}</Link>
          </li>
        ))}
        <li className="nav-links px-4 cursor-pointer capitalize font-medium text-gray-500 hover:scale-105 hover:text-white duration-200 link-underline">
          <button onClick={handleLogout}>Logout</button>
        </li>
      </ul>

      <div
        onClick={() => setNav(!nav)}
        className="cursor-pointer pr-4 z-10 text-gray-500 md:hidden"
      >
        {nav ? <FaTimes size={30} /> : <FaBars size={30} />}
      </div>

      {nav && (
        <ul className="flex flex-col justify-center items-center absolute top-0 left-0 w-full h-screen bg-gradient-to-b from-black to-gray-800 text-gray-500">
          {links.map(({ id, link, text }) => (
            <li
              key={id}
              className="px-4 cursor-pointer capitalize py-6 text-4xl"
            >
              <Link
                onClick={() => setNav(!nav)}
                to={link}
                smooth="true"
                duration={500}
              >
                {text}
              </Link>
            </li>
          ))}
          <li className="px-4 cursor-pointer capitalize py-6 text-4xl">
            <button onClick={handleLogout}>Logout</button>
          </li>
        </ul>
      )}

      {/* User Profile Section */}
      <div className="hidden md:flex items-center ml-4">
        {user && (
          <div className="flex items-center">
            <img
              src={user.picture}
              alt="Profile"
              className="w-8 h-8 rounded-full mr-2"
            />
            <span className="text-gray-300">{user.name}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;