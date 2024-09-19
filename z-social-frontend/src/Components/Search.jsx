import React, { useEffect, useState } from 'react'
import MasonaryLayout from './MasonaryLayout';
import { client } from '../client';
import { feedsQuery,searchQuery } from '../utils/data';
import Spinner from './Spinner';


const Search = ({searchTerm}) => {

  const [pins, setPins] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
  
    if (searchTerm !== '') {
      setLoading(true);
      const query = searchQuery(searchTerm.toLowerCase());
      client.fetch(query).then((data) => {
        setPins(data);
        setLoading(false);
      });
    } else {
      client.fetch(feedsQuery).then((data) => {
        setPins(data);
        setLoading(false);
      });
    }
  }, [searchTerm]);

  return (
    <div>
      {loading && <Spinner msg="Searching for pins..." />}

      {pins && (
        <div>
        {pins?.length !== 0 && <MasonaryLayout pins={pins} />} 
        </div>
      )}
        

      {pins?.length === 0 && searchTerm !== '' && !loading && (
        <div className='mt-10 text-center text-xl'>
          No pins found
        </div>
      )}
    </div>
  )
}

export default Search