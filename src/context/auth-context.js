import React, { useEffect, useState } from "react";
import { auth } from "../firebase-config/config";
import { useAuthState } from "react-firebase-hooks/auth";

export const AuthContext = React.createContext({
  user: null,
  setUser: (val) => {},
  friend: null,
  setFriend: (val) => {},
  removeUser: () => {},
});

const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [friend, setFriend] = useState(null);

  const [userState, loadingState, errorState] = useAuthState(auth);

  useEffect(() => {
    if (userState) {
      const authObj = {
        displayName: userState.displayName,
        photoURL: userState.photoURL,
        uid: userState.uid,
      };

      setUser(authObj);
      setFriend(null);
    }
  }, [userState]);

  const handleSetUser = (val) => {
    setUser(val);
  };

  const handleSetFriend = (val) => {
    setFriend(val);
  };

  const handleRemoveUser = () => {
    setUser(null);
  };

  const contextValue = {
    user,
    setUser: handleSetUser,
    removeUser: handleRemoveUser,
    friend,
    setFriend: handleSetFriend,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export default AuthContextProvider;
