import {
  Fragment,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { NavLink, useLocation, useParams } from "react-router-dom";
import { auth } from "../../firebase-config/config";
import { useAuthState } from "react-firebase-hooks/auth";

import classes from "./Navigation.module.css";
import Search from "../Search/Search";
import { gsap } from "gsap";

const Navigation = ({ onLogout, isLoading }) => {
  const routing = useLocation();
  const [userState, loadingState, errorState] = useAuthState(auth);

  const { id: paramsId } = useParams();

  let appendClasses = (route) =>
    route === routing.pathname ? "active-navbar-link" : "";

  const [widerForm, setWiderForm] = useState(false);
  const [tl, setTl] = useState();
  const liRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      setTl(tl);
    });
    return () => ctx.revert();
  }, []);

  const animateFn = useCallback(() => {
    if (!widerForm) {
      tl.to(liRef.current, {
        width: 400,
        stagger: 0.1,
      });
    } else {
      tl.to(liRef.current, {
        width: 255,
      });
    }
  }, [widerForm, liRef, tl]);

  const handleSearchCLick = (e) => {
    animateFn(e);
    setWiderForm((prev) => !prev);
  };

  return (
    <nav
      className={`${classes["navbar"]} ${
        userState
          ? classes["navbar-logged-in"]
          : classes["navbar-not-logged-in"]
      } ${isLoading ? classes["navbar-loading"] : ""} box-shadow-1`}
    >
      <ul className={classes["navbar-list"]}>
        <li className={appendClasses("/")}>
          <NavLink to="/">
            <svg
              viewBox="0 0 28 28"
              className="x1lliihq x1k90msu x2h7rmj x1qfuztq x5e5rjt"
              fill="#fff"
              height="28"
              width="28"
            >
              <path d="M25.825 12.29C25.824 12.289 25.823 12.288 25.821 12.286L15.027 2.937C14.752 2.675 14.392 2.527 13.989 2.521 13.608 2.527 13.248 2.675 13.001 2.912L2.175 12.29C1.756 12.658 1.629 13.245 1.868 13.759 2.079 14.215 2.567 14.479 3.069 14.479L5 14.479 5 23.729C5 24.695 5.784 25.479 6.75 25.479L11 25.479C11.552 25.479 12 25.031 12 24.479L12 18.309C12 18.126 12.148 17.979 12.33 17.979L15.67 17.979C15.852 17.979 16 18.126 16 18.309L16 24.479C16 25.031 16.448 25.479 17 25.479L21.25 25.479C22.217 25.479 23 24.695 23 23.729L23 14.479 24.931 14.479C25.433 14.479 25.921 14.215 26.132 13.759 26.371 13.245 26.244 12.658 25.825 12.29"></path>
            </svg>
          </NavLink>{" "}
        </li>
        {userState === null && (
          <div className="ml-auto">
            <li className={appendClasses("/login")}>
              <NavLink activeclassname="active-navbar-link" to="/login">
                Login
              </NavLink>
            </li>
          </div>
        )}
        &nbsp;
        {userState && (
          <Fragment>
            <li>
              <NavLink to={`user/${userState?.uid}`}>My Profile</NavLink>
            </li>

            <li
              ref={liRef}
              onBlur={() => {
                setWiderForm(false);
                animateFn();
              }}
              onClick={handleSearchCLick}
              className={`search-li ${classes["no-hover-effect"]} ${
                widerForm ? classes["wider-li"] : ""
              }`}
            >
              <Search />
            </li>

            <div className="ml-auto">
              <li className={classes["logout-link"]}>
                <NavLink onClick={onLogout}>Logout</NavLink>
              </li>
            </div>
          </Fragment>
        )}
      </ul>
    </nav>
  );
};

export default Navigation;
