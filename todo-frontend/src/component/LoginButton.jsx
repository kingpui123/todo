import { useGoogleLogin } from '@react-oauth/google';

const LoginButton = (props) => {

  const login = useGoogleLogin({
    onSuccess: codeResponse => props.onLoginSuccess(codeResponse),
    onError: err => props.onError(err),
    flow: 'auth-code',
  });
  return (
      <button className="drop-shadow-md border rounded px-8 py-4 text-xlduration-200 bg-zinc-100 hover:bg-zinc-200 transition hover:transition-all" onClick={() => login()}>Sign in with Google</button>
  );
}

export default LoginButton;