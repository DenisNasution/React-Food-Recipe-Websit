import { render } from 'preact'
import { App } from './app.jsx'
import React from 'react'
import './index.css'
import { Provider, useDispatch } from "react-redux";
import { persistor, store } from './app/store.js';
import { PersistGate } from 'redux-persist/integration/react';
import { testAuth } from './features/userActions.js';
import { injectStore } from './hooks/useRefreshToken.js';
import { GoogleOAuthProvider } from '@react-oauth/google';

injectStore(store)
// if (process.env.REACT_APP_NODE_ENV === 'development') {
//   console.log = () => {}
//   console.error = () => {}
//   console.debug = () => {}
//   console.info = () => {}
//   console.warn = () => {}
// }
render(<React.StrictMode>
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
    <GoogleOAuthProvider clientId={process.env.GOOGLE_CLIENT_ID}>
      <App/>
    </GoogleOAuthProvider>
    </PersistGate>
  </Provider>
  </React.StrictMode>, document.getElementById('app'))
