import { collection, getDocs, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Friend from "../components/Friends/Friend";
import HomeUsers from "../components/Home/HomeUsers";
import { firestore } from "../firebase-config/config";

import classes from "./styles/FriendsView.module.css";

const FriendsView = () => {
  const { id: paramsId } = useParams();
  const [friends, setFriends] = useState(null);

  useEffect(() => {
    const getFriends = async () => {
      try {
        const buddies = await getDocs(
          query(collection(firestore, "users", paramsId, "friends"))
        );
        if (buddies.docs.length > 0) {
          setFriends(buddies.docs);
        }
      } catch (error) {
        console.log(error, "FriendsView.js");
      }
    };
    getFriends();
  }, []);

  return (
    <div className={classes["friends-view-wrapper"]}>
      <h3>Friends View</h3>

      {Array.isArray(friends) && friends.length > 0 && (
        <HomeUsers
          users={friends.map((friend) => ({
            ...friend.data(),
            id: friend.data().friendId,
          }))}
        />
      )}
    </div>
  );
};

export default FriendsView;
