import React from 'react';
import { useLocation } from 'react-router';

export default function AuthUnauthorized() {
  const location = useLocation();
  const errorMessage = location.state?.error || 'Authorization failed. Please check your credentials and try again.';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', padding: '20px' }}>
      <h2>Access Denied</h2>
      <p>{errorMessage}</p>
      <a href="/auth/login" style={{ marginTop: '20px', textDecoration: 'underline' }}>
        Return to Login
      </a>
    </div>
  );
}