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
