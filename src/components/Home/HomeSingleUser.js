import { setDoc, collection, doc, getDoc } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { firestore } from "../../firebase-config/config";
import Alert from "../UI/Alert";

import classes from "./HomeSingleUser.module.css";

const HomeSingleUser = ({ user, userState }) => {
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate();

  const [alreadyAdded, setAlreadyAdded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showAddFriendBtn, setShowAddFriendBtn] = useState(false);

  const getFriendCallback = useCallback(async () => {
    setShowAddFriendBtn(false);
    if (!userState) return;

    try {
      const friend = await getDoc(
        doc(firestore, "users", userState.uid, "friends", user.id)
      );

      if (friend.exists()) {
        setAlreadyAdded(true);
      } else {
        setAlreadyAdded(false);
        setShowAddFriendBtn(true);
      }
      setLoading(false);
    } catch (error) {
      console.log(error, "HomeUsers.js");
    }
  }, [userState?.uid, user.id]);

  const setFriendCallback = useCallback(
    async ({ id, displayName, photoURL }) => {
      setLoading(true);
      if (!userState) return;

      try {
        await setDoc(doc(firestore, "users", userState.uid, "friends", id), {
          friendId: id,
          displayName,
          photoURL,
        });
      } catch (error) {
        console.log(error, "HomeSingleUser.js");
      }
    },
    [userState?.uid, user.id, user.displayName, user.photoURL]
  );

  useEffect(() => {
    getFriendCallback();
  }, [getFriendCallback]);

  const handleAddFriend = async ({ id, displayName, photoURL }) => {
    if (!userState) return;

    try {
      await setFriendCallback({ id, displayName, photoURL });
      await getFriendCallback();

      setShowAlert(true);
    } catch (error) {
      console.log(error, "HomeUsers.js");
    }
  };

  const handleCloseAlert = (e) => {
    e.preventDefault();
    setShowAlert(false);
  };

  return (
    <div
      key={user.id}
      className={`${classes["home-users__single"]} ${
        userState ? classes["add-pb"] : ""
      }`}
    >
      {showAlert && (
        <Alert onClick={handleCloseAlert} position="right">
          {user.displayName} was added!
        </Alert>
      )}
      <img
        src={user.photoURL}
        alt={user.displayName}
        title={user.displayName}
      />
      <h5>{user.displayName}</h5>
      <div>
        <button
          onClick={() => {
            navigate(`/user/${user.id}`);
          }}
        >
          See {user.displayName}
        </button>
        {userState && userState.uid !== user.id && !alreadyAdded && (
          <button
            className={`${loading ? classes["loading"] : ""} ${
              classes["add-friend"]
            } ${showAddFriendBtn ? classes["show-btn"] : ""}`}
            onClick={handleAddFriend.bind(null, user)}
          >
            {loading && <span></span>}
            Add {user.displayName}
          </button>
        )}
      </div>
    </div>
  );
};

export default HomeSingleUser;
