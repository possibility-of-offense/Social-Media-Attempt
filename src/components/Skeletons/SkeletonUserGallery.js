import classes from "./SkeletonUserGallery.module.css";

const SkeletonUserGallery = () => {
  return (
    <div className={classes["skeleton-gallery-wrapper"]}>
      <div className={classes["skeleton-gallery-wrapper__header"]}>
        <h3>Gallery</h3>
        <div></div>
      </div>
      <div className={classes["skeleton-gallery-wrapper__body"]}>
        <div></div>
      </div>
    </div>
  );
};

export default SkeletonUserGallery;
