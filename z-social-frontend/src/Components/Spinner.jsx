import React from 'react';
import {Circles} from 'react-loader-spinner';

function Spinner({ msg }) {
  return (
    <div className="flex flex-col justify-center items-center w-full h-full">
      <Circles
        color="#00BFFF"
        height={50}
        width={200}
        className="m-5"
        visible={true}
        ariaLabel="Loading..."
      />
      <p className="text-lg text-center px-2">{msg}</p>
    </div>
  );
}

export default Spinner;