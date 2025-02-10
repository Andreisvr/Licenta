import React from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App';
import { AppProvider } from './components/AppContext';

const container = document.getElementById('root');
const root = createRoot(container); // Creează un "root" folosind createRoot

root.render(
  <GoogleOAuthProvider clientId="348910342280-ahovt5cldc7vo73v3df1ur9bmhv5q8uh.apps.googleusercontent.com">
    <React.StrictMode>
      <AppProvider>
        <App />
      </AppProvider>
    </React.StrictMode>
  </GoogleOAuthProvider>
);
// nqkx snel lqha hwgr