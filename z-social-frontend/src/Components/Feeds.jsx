import React , {useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';

import { client } from '../client';
import MasonaryLayout from './MasonaryLayout';
import Spinner from './Spinner';
import { feedsQuery, searchQuery } from '../utils/data';
const Feeds = () => {

  const {categoryId} = useParams();
  const [pins, setPins] = useState(null);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    setLoading(true)
    
    if(categoryId){
      const query = searchQuery(categoryId);
      
      client.fetch(query)
      .then(
        (data) => {
          setPins(data);
          setLoading(false);
        }
      )

    } else {
      client.fetch(feedsQuery)
      .then((data) =>{
        setPins(data);
        setLoading(false);
      })
    }
    
  }, [categoryId])
  if (loading) {
    return <Spinner msg="We are adding new ideas to your feeds" />
  }
  return (
    <div>
      {pins && (<MasonaryLayout pins={pins}/>)}
    </div>
  )
}

export default Feeds