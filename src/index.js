import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { BrowserRouter } from "react-router-dom";
import { Provider } from 'react-redux';
import store from './store/index'; 
import './i18n'; 
import axios from "axios";
import appConfig from './store/settings';

axios.interceptors.request.use((request) => {
  request.headers.Authorization = `Bearer ${localStorage.authToken}`
  request.url = appConfig.apiPath + request.url;
  return request
})

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Provider store={store}> 
      <App /> 
    </Provider>
  </BrowserRouter>
);

 
reportWebVitals();
