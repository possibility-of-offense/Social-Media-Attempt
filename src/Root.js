import { signOut } from "firebase/auth";
import { useContext, useState } from "react";
import {
  Outlet,
  useLocation,
  useNavigate,
  useNavigation,
} from "react-router-dom";
import Navigation from "./components/Generic/Navigation";
import LoadingOverlay from "./components/Generic/Overlay";
import { AuthContext } from "./context/auth-context";
import { ImagesContext } from "./context/images-context";
import { auth } from "./firebase-config/config";
import AuthContextProvider from "./context/auth-context";
import { useAuthState } from "react-firebase-hooks/auth";

function Root() {
  const navigate = useNavigate();
  const navigation = useNavigation();
  const location = useLocation();

  const authContext = useContext(AuthContext);
  const [images, setImages] = useState([]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      authContext.removeUser();
      navigate("/");
    } catch (error) {
      console.log(error, "Root.js");
    }
  };

  const [userState, loadingState, errorState] = useAuthState(auth);

  const isGalleryView = location.pathname.startsWith("/gallery/");

  return (
    <div className="Root">
      <Navigation onLogout={handleLogout} isLoading={loadingState} />
      {navigation.state === "submitting" && <LoadingOverlay />}
      <div className={isGalleryView ? "" : `outlet`}>
        <ImagesContext.Provider value={{ images, setImages }}>
          <AuthContextProvider>
            {loadingState ? <LoadingOverlay /> : <Outlet />}
          </AuthContextProvider>
        </ImagesContext.Provider>
      </div>
    </div>
  );
}

export default Root;
