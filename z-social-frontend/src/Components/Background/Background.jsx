import React from 'react';
import "./Background.css"

const Background = ({ children }) => {
  return (
      <div className="bgBox overflow-hidden w-screen bg-black ">
        {children}
      </div>
  );
}

export default Background;
