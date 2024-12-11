import React, { useState, useEffect, useRef } from 'react';
import { HiMenu } from 'react-icons/hi';
import { AiFillCloseCircle } from 'react-icons/ai';
import { Link, Route, Routes } from 'react-router-dom';
import { Sidebar, UserProfile } from '../Components';
import { client } from '../client';
import logo from '../assets/logo.png';
import Pins from './Pins';
import { userQuery } from '../utils/data';
import { fetchUser } from '../utils/fetchUser';
import transition from '../transition';

const Home = () => {
  const [toggleSidebar, setToggleSidebar] = useState(false);
  const [User, setUser] = useState(null);
  const scrollRef = useRef(null);

  // Fetch user information from localStorage
  const userInfo = fetchUser();

  useEffect(() => {
    // Check if userInfo exists and has a googleId before making the query
    if (userInfo?.googleId) {
      const query = userQuery(userInfo.googleId);
      client.fetch(query).then((data) => {
        setUser(data[0]);
      });
    }
  }, [userInfo?.googleId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo(0, 0);
    }
  }, []);

  // Handle case where no user is logged in
  if (!userInfo) {
    return (
      <div className="flex items-center justify-center h-screen">
        <h1>Please log in to view this page</h1>
        <div className="flex flex-col justify-start items-center w-full h-full">
          <Link to={userInfo ? "/explore" : "/login"}>
            <button class="relative inline-block p-px font-semibold leading-6 text-white bg-gray-800 shadow-2xl cursor-pointer rounded-xl shadow-zinc-900 transition-transform duration-300 ease-in-out hover:scale-105 active:scale-95">
              <span class="absolute inset-0 rounded-xl bg-gradient-to-r from-teal-400 via-blue-500 to-purple-500 p-[2px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"></span>

              <span class="relative z-10 block px-6 py-3 rounded-xl bg-gray-950">
                <div class="relative z-10 flex pointer-events-auto items-center space-x-2">
                  <span class="transition-all duration-500 group-hover:translate-x-1">
                    Let's get started
                  </span>
                  <svg
                    class="w-6 h-6 transition-transform duration-500 group-hover:translate-x-1"
                    data-slot="icon"
                    aria-hidden="true"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      clip-rule="evenodd"
                      d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z"
                      fill-rule="evenodd"></path>
                  </svg>
                </div>
              </span>
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex bg-gray-50 md:flex-row flex-col h-screen transition-height duration-75 ease-out">
      <div className="hidden md:flex h-screen flex-initial">
        <Sidebar user={User} />
      </div>
      <div className="flex md:hidden flex-row">
        <div className="p-2 w-full flex flex-row justify-between items-center shadow-md">
          <HiMenu fontSize={40} className="cursor-pointer" onClick={() => setToggleSidebar(true)} />
          <Link to="/">
            <img src={logo} alt="Logo" className="w-28" />
          </Link>
          <Link to={`../user-profile/${User?._id}`}>
            <img src={User?.image} alt="User" className="md:w-28 w-14 md:h-28 h-14" />
          </Link>
        </div>
        {toggleSidebar && (
          <div className="fixed w-4/5 bg-white h-screen overflow-y-auto shadow-md z-10 animate-slide-in">
            <div className="absolute w-full flex justify-end items-center p-2">
              <AiFillCloseCircle fontSize={30} className="cursor-pointer" onClick={() => setToggleSidebar(false)} />
            </div>
            <Sidebar closeToggle={setToggleSidebar} user={User} />
          </div>
        )}
      </div>
      <div className="pb-2 flex-1 h-screen overflow-y-scroll" ref={scrollRef}>
        <Routes>
          <Route path="/*" element={<Pins user={User} />} />
          <Route path="/user-profile/:userId" element={<UserProfile />} />
        </Routes>
      </div>
    </div>
  );
};

export default transition(Home);
