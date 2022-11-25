import { signOut } from "firebase/auth";
import { useContext } from "react";
import { Outlet, useNavigate, useNavigation } from "react-router-dom";
import Navigation from "./components/Generic/Navigation";
import LoadingOverlay from "./components/Generic/Overlay";
import { AuthContext } from "./context/auth-context";
import { auth } from "./firebase-config/config";
import { removeFromLocalStorage } from "./helpers/local-storage";

function Root() {
  const navigate = useNavigate();
  const navigation = useNavigation();
  const authContext = useContext(AuthContext);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      removeFromLocalStorage("user");
      authContext.removeUser();
      navigate("/");
    } catch (error) {
      console.log(error, "Root.js");
    }
  };

  return (
    <div className="Root">
      <Navigation onLogout={handleLogout} />
      {navigation.state === "submitting" && <LoadingOverlay />}
      <div className="outlet">
        <Outlet />
      </div>
    </div>
  );
}

export default Root;
