import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

const init = () => {
  const element = <App />;
  const root = ReactDOM.createRoot(
    document.getElementById('chat'),
  );
  root.render(element);
};

export default init;
