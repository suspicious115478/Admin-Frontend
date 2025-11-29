// src/index.js

import React from 'react';
import ReactDOM from 'react-dom/client';
// You might need to import a CSS file here for global styling, e.g., './index.css'
import App from './App'; // Import the main application component

const root = ReactDOM.createRoot(document.getElementById('root'));

// This renders the main App component into the root DOM element.
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Note: If you were using an older React version (before React 18), 
// the rendering would use: ReactDOM.render(<App />, document.getElementById('root'));
