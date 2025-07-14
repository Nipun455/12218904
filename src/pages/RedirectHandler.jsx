import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { logEvent } from '../utils/LoggerMiddleware';

const RedirectHandler = () => {
  const { shortcode } = useParams();

  useEffect(() => {
    const stored = localStorage.getItem('urlMappings');
    const data = stored ? JSON.parse(stored) : {};
    const target = data[shortcode];

    if (!target || Date.now() > target.expiresAt) {
      alert('This link is invalid or has expired.');
      return;
    }

    const clickRecord = {
      timestamp: new Date().toISOString(),
      referrer: document.referrer || 'N/A',
      location: 'Unknown',
    };

    target.clicks.push(clickRecord);
    data[shortcode] = target;
    localStorage.setItem('urlMappings', JSON.stringify(data));
    logEvent(`User redirected to ${target.longUrl}`);
    window.location.href = target.longUrl;
  }, [shortcode]);

  return <p>Redirecting you to the destination...</p>;
};

export default RedirectHandler;
