import { useGoogleLogin } from '@react-oauth/google';

const LoginButton = (props) => {

  const login = useGoogleLogin({
    onSuccess: codeResponse => console.log(codeResponse),
    flow: 'auth-code',
  });
  return (
      <button onClick={() => login()}>Sign in with Google 🚀</button>
  );
}

export default LoginButton;