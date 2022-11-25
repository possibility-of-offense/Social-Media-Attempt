import { deleteDoc, doc } from "firebase/firestore";
import { useContext } from "react";
import { useFetcher } from "react-router-dom";
import { AuthContext } from "../../context/auth-context";
import { firestore } from "../../firebase-config/config";
import classes from "./UserSinglePost.module.css";

import like from "./like.png";
import charBallong from "./chat-balloon.png";

export async function deleteAction({ request }) {
  const formData = await request.formData();
  const id = Object.keys(Object.fromEntries(formData))[0];

  await deleteDoc(doc(firestore, "posts", id));
}

const UserSinglePost = ({ post }) => {
  const authContext = useContext(AuthContext);
  const date = new Date(post.dateCreated.seconds * 1000);
  const showDate =
    date.getDate() +
    ":" +
    (Number(date.getMonth()) + 1) +
    ":" +
    date.getFullYear();

  const fetcher = useFetcher();

  return (
    <div
      className={`${classes.post} ${
        fetcher.state === "submitting" || fetcher.state === "loading"
          ? classes["post-loading"]
          : ""
      }`}
    >
      <div>
        <fetcher.Form method="post">
          <button className={classes["delete-btn"]} name={post.id}>
            Delete post
          </button>
        </fetcher.Form>
        <img
          alt={authContext.user.displayName}
          title={authContext.user.displayName}
          src={authContext.user.photoURL}
        />
        <h3>{post.title}</h3> &nbsp; &#8226; &nbsp;
        <span>{showDate}</span>
      </div>
      <p>{post.content}</p>
      <div className={classes["post-actions"]}>
        <button>
          <img alt="Like" title="Like" src={like} />
          <span>Like</span>
        </button>
        <button>
          <img alt="Comment" title="Comment" src={charBallong} />
          <span>Comment</span>
        </button>
      </div>
    </div>
  );
};

export default UserSinglePost;
