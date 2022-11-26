import { useNavigate } from "react-router-dom";
import { auth } from "../firebase-config/config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";

import classes from "./styles/Login.module.css";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);
    const userData = Object.fromEntries(formData);

    const firebaseInfo = await signInWithEmailAndPassword(
      auth,
      userData.email,
      userData.password
    );

    setLoading(false);
    navigate("/user/" + firebaseInfo.user.uid);
  };

  return (
    <div className="form">
      <h4>Login</h4>
      <form method="post" onSubmit={handleLogin}>
        <input type="text" name="email" defaultValue="conscience90@gmail.com" />
        <input type="text" name="password" defaultValue="test1234" />
        <div className="flex">
          <button
            className={`${"box-shadow-2 ml-auto"} ${classes.btn}`}
            type="submit"
          >
            <span className={loading ? classes["hide-login-span"] : ""}>
              Login
            </span>
            {loading && (
              <div className={classes["lds-ring"]}>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
