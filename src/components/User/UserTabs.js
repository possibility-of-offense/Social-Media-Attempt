import { Fragment, useEffect, useLayoutEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";

import classes from "./UserTabs.module.css";

const UserTabs = ({ user }) => {
  const routing = useLocation();
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

  return (
    <ul className={classes["tabs"]} ref={listRef}>
      {user && (
        <Fragment>
          <li className={appendClasses(`/user/${user.uid}`)}>
            <NavLink to={`/user/${user.uid}`}>Create Post</NavLink>
          </li>
          <li className={appendClasses(`/user/${user.uid}/posts`)}>
            <NavLink to="posts">My posts</NavLink>
          </li>
          <li className={appendClasses(`/user/${user.uid}/gallery`)}>
            <NavLink to="gallery">Gallery</NavLink>
          </li>
          <li className={appendClasses(`/user/${user.uid}/edit-info`)}>
            <NavLink to="edit-info">Edit Info</NavLink>
          </li>
        </Fragment>
      )}
    </ul>
  );
};

export default UserTabs;
