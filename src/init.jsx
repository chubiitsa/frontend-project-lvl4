import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './store.js';
import App from './App.jsx';

const init = () => {
  const root = ReactDOM.createRoot(
    document.getElementById('chat'),
  );
  root.render(
    <Provider store={store} id="provider">
      <App />
    </Provider>,
  );
};

export default init;
