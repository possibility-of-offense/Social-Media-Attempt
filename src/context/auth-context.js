import React, { useEffect, useState } from "react";
import { auth } from "../firebase-config/config";
import { onAuthStateChanged } from "firebase/auth";
import { setLocalStorage } from "../helpers/local-storage";

export const AuthContext = React.createContext({
  user: null,
  setUser: (val) => {},
  removeUser: () => {},
});

const AuthContextProvider = ({ session, children }) => {
  const [user, setUser] = useState(session);

  useEffect(() => {
    onAuthStateChanged(auth, (obj) => {
      if (obj) {
        const authObj = {
          displayName: obj.displayName,
          photoURL: obj.photoURL,
          uid: obj.uid,
        };

        setUser(authObj);
        setLocalStorage("user", authObj);
      }
    });
  }, []);

  const handleSetUser = (val) => {
    setUser(val);
  };

  const handleRemoveUser = () => setUser(null);

  const contextValue = {
    user,
    setUser: handleSetUser,
    removeUser: handleRemoveUser,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export default AuthContextProvider;
