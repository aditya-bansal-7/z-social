import React, { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import  Login  from './Components/Login';
import Home from './Container/Home';

const App = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user && user !== 'undefined') {
      const parsedUser = JSON.parse(user);
      if (!parsedUser) {
        localStorage.clear();
        navigate('/login');
      }
    } else {
      localStorage.clear();
      navigate('/login');
    }
  }, [navigate]);

  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route path="/*" element={<Home />} />
    </Routes>
  );
};

export default App;
