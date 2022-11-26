import { Fragment, useLayoutEffect, useRef } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { NavLink, useLocation, useParams } from "react-router-dom";
import { auth } from "../../firebase-config/config";

import classes from "./UserTabs.module.css";

const UserTabs = ({ user, friend }) => {
  const routing = useLocation();
  const { id: paramsId } = useParams();

  let appendClasses = (route) => {
    return route === routing.pathname ? "active-tabs-link" : "";
  };

  const listRef = useRef(null);

  useLayoutEffect(() => {
    const handleListItemClick = (e) => {
      if (e.target.tagName === "LI" || e.target.closest("li")) {
        e.target.closest("li").classList.add("active-tabs-link");
      }
    };
    listRef.current.addEventListener("click", handleListItemClick);

    return () =>
      listRef.current?.removeEventListener("click", handleListItemClick);
  }, []);

  const [userState] = useAuthState(auth);

  return (
    <ul className={classes["tabs"]} ref={listRef}>
      <Fragment>
        {user && user?.uid === paramsId && (
          <li className={appendClasses(`/user/${user?.uid}`)}>
            <NavLink to={`/user/${user.uid}`}>Create Post</NavLink>
          </li>
        )}

        <Fragment>
          <li className={appendClasses(`/user/${paramsId}/posts`)}>
            <NavLink to="posts">
              {userState?.uid === paramsId
                ? "My posts"
                : `The posts of ${friend?.displayName}`}
            </NavLink>
          </li>
          <li className={appendClasses(`/user/${paramsId}/gallery`)}>
            <NavLink to="gallery">Gallery</NavLink>
          </li>
        </Fragment>

        {userState?.uid === paramsId && (
          <li className={appendClasses(`/user/${user?.uid}/edit-info`)}>
            <NavLink to="edit-info">Edit Info</NavLink>
          </li>
        )}
      </Fragment>
    </ul>
  );
};

export default UserTabs;
