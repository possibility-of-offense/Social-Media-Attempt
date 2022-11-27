import { collection, doc, getDoc, getDocs, query } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import {
  Link,
  Outlet,
  useNavigate,
  useNavigation,
  useParams,
} from "react-router-dom";
import SkeletonUserGallery from "../components/Skeletons/SkeletonUserGallery";
import SkeletonUserPosts from "../components/Skeletons/SkeletonUserPosts";
import UserTabs from "../components/User/UserTabs";
import { AuthContext } from "../context/auth-context";
import { auth, firestore } from "../firebase-config/config";
import { useAuthState } from "react-firebase-hooks/auth";

import classes from "./styles/User.module.css";

const User = () => {
  const { friend, setFriend } = useContext(AuthContext);
  const navigate = useNavigate();
  const navigation = useNavigation();
  const { id: paramsId } = useParams();

  const [userState, loading] = useAuthState(auth);
  const [friendsLen, setFriendsLen] = useState(null);

  useEffect(() => {
    async function getUserInfo() {
      try {
        const user = await getDoc(doc(firestore, "users", paramsId));

        if (user.exists()) {
          setFriend(user.data());
        }
      } catch (error) {
        console.log(error, "User.js");
      }
    }

    async function getAllFriends() {
      try {
        const friends = await getDocs(
          query(collection(firestore, "users", paramsId, "friends"))
        );
        if (friends.docs.length > 0) setFriendsLen(friends.docs.length);
      } catch (error) {
        console.log(error, "User.js");
      }
    }
    getAllFriends();

    console.log("starts");

    if (!userState || userState.uid !== paramsId) {
      getUserInfo().then((res) => {
        navigate("posts");
      });
    }
  }, [userState]);

  const [showSkeletonGalleryImage, setShowSkeletonGalleryImage] =
    useState(false);
  useEffect(() => {
    if (navigation.state === "loading") {
      setShowSkeletonGalleryImage(true);
    } else {
      setShowSkeletonGalleryImage(false);
    }
  }, [navigation.state]);

  return (
    <div className={`${classes["user-view"]} box-shadow-2`}>
      <div className={classes["user-view__avatar"]}>
        <p>
          {userState?.uid === paramsId
            ? userState?.displayName
            : friend?.displayName}
        </p>
        <div className={classes["user-view__avatar-img-container"]}>
          <img
            src={
              userState?.uid === paramsId
                ? userState?.photoURL
                : friend?.photoURL
            }
            alt="Profile Picture"
            title="Profile Picture"
            className="box-shadow-2"
          />
        </div>
        <div>
          <br />
          {friendsLen !== null && (
            <h5>
              <Link to="friends">
                Friend{friendsLen > 1 ? "s" : ""} - {friendsLen}
              </Link>
            </h5>
          )}
        </div>
      </div>

      <div className={classes["user-tabs"]}>
        <UserTabs user={userState} friend={friend} />

        {navigation.state === "loading" &&
          navigation.location.pathname.includes("/posts") && (
            <SkeletonUserPosts />
          )}

        {navigation.state === "loading" &&
          navigation.location.pathname.includes("/gallery/") && (
            <div className={classes["skeleton-gallery-image"]}></div>
          )}

        {navigation.state === "loading" &&
          navigation.location.pathname.endsWith("/gallery") && (
            <SkeletonUserGallery
              isAuthor={paramsId === userState?.currentUser?.uid}
            />
          )}

        {navigation.state === "idle" && (
          <Outlet context={showSkeletonGalleryImage} />
        )}
      </div>
    </div>
  );
};

export default User;
