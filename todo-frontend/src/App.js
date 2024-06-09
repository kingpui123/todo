import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import LoginButton from './component/LoginButton.jsx'
import './App.css';

function App() {

  return (
    <GoogleOAuthProvider clientId="658022931842-cptmdomekm94vvprbeafpedjuspkdfr6.apps.googleusercontent.com">
     <LoginButton />
    </GoogleOAuthProvider>
  );
}

export default App;
