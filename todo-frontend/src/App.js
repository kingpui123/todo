import { GoogleOAuthProvider } from '@react-oauth/google';
import { UserProvider } from './context/UserContext.jsx';
import TodoWrapper from './wrapper/TodoWrapper.jsx';

import './App.css';

function App() {



  return (
    <GoogleOAuthProvider clientId="658022931842-cptmdomekm94vvprbeafpedjuspkdfr6.apps.googleusercontent.com">
      <UserProvider>
          <TodoWrapper />
      </UserProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
