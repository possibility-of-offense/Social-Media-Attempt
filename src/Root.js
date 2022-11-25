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
import { removeFromLocalStorage } from "./helpers/local-storage";

function Root() {
  const navigate = useNavigate();
  const navigation = useNavigation();
  const location = useLocation();

  const authContext = useContext(AuthContext);
  const [images, setImages] = useState([]);

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

  const isGalleryView = location.pathname.startsWith("/gallery/");

  return (
    <div className="Root">
      <Navigation onLogout={handleLogout} />
      {navigation.state === "submitting" && <LoadingOverlay />}
      <div className={isGalleryView ? "" : `outlet`}>
        <ImagesContext.Provider value={{ images, setImages }}>
          <Outlet />
        </ImagesContext.Provider>
      </div>
    </div>
  );
}

export default Root;
