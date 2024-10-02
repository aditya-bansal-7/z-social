import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { client } from '../client';
import MasonaryLayout from './MasonaryLayout';
import Spinner from './Spinner';
import { feedsQuery, searchQuery } from '../utils/data';

const Feeds = () => {
  const { categoryId } = useParams();
  const [pins, setPins] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // Added error state

  useEffect(() => {
    setLoading(true);
    setError(null); // Reset the error state before making a new request

    const query = categoryId ? searchQuery(categoryId) : feedsQuery;

    client.fetch(query)
      .then((data) => {
        setPins(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching data:', err);
        setError('Could not fetch pins, please try again.');
        setLoading(false);
      });
  }, [categoryId]);

  if (loading) {
    return <Spinner msg="We are adding new ideas to your feeds" />;
  }

  if (error) {
    return <div className="text-center mt-5">{error}</div>;
  }

  if (!pins?.length) {
    return <div className="text-center mt-5">No pins available in this category</div>;
  }

  return <MasonaryLayout pins={pins} />;
};

export default Feeds;
