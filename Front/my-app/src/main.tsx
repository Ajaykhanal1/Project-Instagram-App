import { StrictMode } from 'react'
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import './index.css'
import App from './App.tsx'
import { GoogleOAuthProvider } from '@react-oauth/google';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
      <GoogleOAuthProvider clientId="764087154942-f4dbi1no5kh37vqaapufn8q8tbn52ob6.apps.googleusercontent.com">

  <StrictMode>
    <App />
  </StrictMode>
  </GoogleOAuthProvider>
  </BrowserRouter>
)
