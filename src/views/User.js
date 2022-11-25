import { useContext, useEffect } from "react";
import { NavLink, Outlet, useNavigate, useNavigation } from "react-router-dom";
import SkeletonUserGallery from "../components/Skeletons/SkeletonUserGallery";
import SkeletonUserPosts from "../components/Skeletons/SkeletonUserPosts";
import UserTabs from "../components/User/UserTabs";
import { AuthContext } from "../context/auth-context";
import { auth } from "../firebase-config/config";
import { getFromLocalStorage, setLocalStorage } from "../helpers/local-storage";

import classes from "./styles/User.module.css";

const User = () => {
  const { user } = useContext(AuthContext);
  const userLocal = getFromLocalStorage("user");
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();
  const navigation = useNavigation();

  useEffect(() => {
    if (!userLocal) {
      if (auth && auth.currentUser) {
        authContext.setUser({
          displayName: auth.currentUser.displayName,
          photoURL: auth.currentUser.photoURL,
          uid: auth.currentUser.uid,
        });
        setLocalStorage("user", authContext.user);
      }
    }
  }, [authContext.user]);

  useEffect(() => {
    const userLocal = getFromLocalStorage("user");
    console.log(userLocal);
    if (!userLocal) navigate("/");
  }, []);

  return (
    <div className={`${classes["user-view"]} box-shadow-2`}>
      <div className={classes["user-view__avatar"]}>
        <p>{user?.displayName}</p>
        <div className={classes["user-view__avatar-img-container"]}>
          <img
            src={user?.photoURL}
            alt="Profile Picture"
            title="Profile Picture"
            className="box-shadow-2"
          />
        </div>
      </div>
      <div className={classes["user-tabs"]}>
        <UserTabs user={authContext.user} />

        {navigation.state === "loading" &&
          navigation.location.pathname.includes("/posts") && (
            <SkeletonUserPosts />
          )}

        {navigation.state === "loading" &&
          navigation.location.pathname.includes("/gallery") && (
            <SkeletonUserGallery />
          )}

        {navigation.state === "idle" && <Outlet />}
      </div>
    </div>
  );
};

export default User;
