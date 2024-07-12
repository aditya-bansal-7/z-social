import React, {useState} from 'react'
import { Navbar,Feeds,CreatePin,PinDetails,Search } from '../Components'
import { Route, Routes } from 'react-router-dom'
const Pins = (user) => {
  const [searchTerm, setSearchTerm] = useState('');
  return (
    <div className='px-2 md:px-5  mt-6'>
      <div className='bg-gray-50'>
        <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} user={user && user} />
      </div>
      <div className='h-full'>
        <Routes>
          <Route path='/*'  element={<Feeds/>} />
          <Route path='/category/:categoryId' element={<Feeds />} />
          <Route path='/pin-detail/:pinId' element={<PinDetails user={user && user} />} />
          <Route path='create-pin' element={<CreatePin user={user && user} />}/>
          <Route path='/search' element={<Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} user={user&&user}/>} />
        </Routes>
      </div>
    </div>
  )
}

export default Pins