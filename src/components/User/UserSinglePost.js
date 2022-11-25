import { useContext } from "react";
import { AuthContext } from "../../context/auth-context";
import classes from "./UserSinglePost.module.css";

const UserSinglePost = ({ post }) => {
  const authContext = useContext(AuthContext);
  const date = new Date(post.dateCreated.seconds * 1000);
  const showDate =
    date.getDate() +
    ":" +
    (Number(date.getMonth()) + 1) +
    ":" +
    date.getFullYear();

  return (
    <div className={`${classes.post}`}>
      <div>
        <img
          alt={authContext.user.displayName}
          title={authContext.user.displayName}
          src={authContext.user.photoURL}
        />
        <h3>{post.title}</h3> &nbsp; &#8226; &nbsp;
        <span>{showDate}</span>
      </div>
      <p>{post.content}</p>
    </div>
  );
};

export default UserSinglePost;
