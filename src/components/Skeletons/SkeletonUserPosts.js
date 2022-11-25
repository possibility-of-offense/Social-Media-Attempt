import classes from "./SkeletonUserPosts.module.css";

const SkeletonUserPosts = () => {
  return (
    <div className={classes["skeleton-wrapper"]}>
      <h3>My posts</h3>
      <div></div>
      <div></div>
      <div></div>

      <div></div>
      <div></div>
      <div></div>
    </div>
  );
};

export default SkeletonUserPosts;
