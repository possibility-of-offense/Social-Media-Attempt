import { Form, redirect, useNavigate } from "react-router-dom";
import { auth } from "../firebase-config/config";
import { setLocalStorage } from "../helpers/local-storage";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useAuthState } from "../hooks/useAuthState";
import { useEffect } from "react";

export async function loginAction({ request }) {
  const data = await request.formData();
  const info = Object.fromEntries(data);
  const { user } = await signInWithEmailAndPassword(
    auth,
    info.email,
    info.password
  );

  setLocalStorage("user", {
    id: user.uid,
    name: user.displayName,
    image: user.photoURL,
  });

  console.log(user.uid);

  return redirect(`/user/${user.uid}`);
}

const Login = () => {
  const { user } = useAuthState();
  const navigate = useNavigate();

  // useEffect(() => {
  //   if (user) navigate("/");
  // }, []);

  return (
    <div className="form">
      <h4>Login</h4>
      <Form method="post">
        <input type="text" name="email" defaultValue="conscience90@gmail.com" />
        <input type="text" name="password" defaultValue="test1234" />
        <div className="flex">
          <button className="box-shadow-2 ml-auto" type="submit">
            Login
          </button>
        </div>
      </Form>
    </div>
  );
};

export default Login;
