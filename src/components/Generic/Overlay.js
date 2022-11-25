import classes from "./Overlay.module.css";

const LoadingOverlay = () => {
  return (
    <div className={classes["overlay"]}>
      <div className={classes["lds-facebook"]}>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default LoadingOverlay;
