import { useContext } from "react";
import { AuthContext } from "../context/auth-context";

export const useAuthState = () => {
  const auth = useContext(AuthContext);
  return auth;
};
