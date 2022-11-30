import { useContext, useEffect, useRef } from "react";
import { AuthContext } from "../../context/auth-context";
import classes from "./Modal.module.css";

const Modal = () => {
  const authContext = useContext(AuthContext);

  useEffect(() => {
    let timer = setTimeout(() => {
      authContext.onHideModal();
    }, 5000);

    return () => clearTimeout(timer);
  });
  if (!authContext.hideModal) {
    return (
      <div className={classes["initial-modal"]}>
        <div>
          <h5>There are only two registered users:</h5>
          <p>Username: conscience90@gmail.com | Password: test1234</p>
          <p>Username: ventsi90@gmail.com | Password: ventsi1234</p>
        </div>
      </div>
    );
  }
};

export default Modal;
