import React, { useEffect, useState } from 'react';
import API from '../api/axios';

export default function LandingPage() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    API.get('/landing_page/')
      .then(response => setMessage(response.data.message))
      .catch(() => setMessage('Failed to load message'));
  }, []);

  return (
    <div>
      {console.log({message})}
    </div>
  );
}
