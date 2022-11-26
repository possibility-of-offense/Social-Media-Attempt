import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { useFetcher, useParams } from "react-router-dom";
import { AuthContext } from "../../context/auth-context";
import { auth, firestore } from "../../firebase-config/config";
import classes from "./UserSinglePost.module.css";

import like from "./like.png";
import charBallong from "./chat-balloon.png";
import { useAuthState } from "react-firebase-hooks/auth";
import UserCommentForm from "./UserCommentForm";
import UserComments from "./UserComments";

export async function deleteAction({ request }) {
  const formData = await request.formData();
  const id = Object.keys(Object.fromEntries(formData))[0];

  await deleteDoc(doc(firestore, "posts", id));
}

const UserSinglePost = ({ post }) => {
  const { friend } = useContext(AuthContext);
  const { id: paramsId } = useParams();

  const [userState, loadingState, errorState] = useAuthState(auth);

  // Date
  const date = new Date(post.dateCreated.seconds * 1000);
  const showDate =
    date.getDate() +
    ":" +
    (Number(date.getMonth()) + 1) +
    ":" +
    date.getFullYear() +
    " -- " +
    date.getHours() +
    ":" +
    date.getMinutes();

  const [alreadyLikes, setAlreadyLikes] = useState(false);
  const [likesNumber, setLikesNumber] = useState(0);

  const [showCommentForm, setShowCommentForm] = useState(false);

  useEffect(() => {
    async function getLikes() {
      const [alreadyLiked, likesNum] = await Promise.all([
        getDocs(
          query(
            collection(firestore, "posts", post.id, "likes"),
            where("ownerId", "==", userState.uid)
          )
        ),
        getDocs(query(collection(firestore, "posts", post.id, "likes"))),
      ]);

      if (alreadyLiked.docs.length > 0) {
        setAlreadyLikes(true);
      }
      if (likesNum.docs.length > 0) {
        setLikesNumber(likesNum.docs.length);
      }
    }
    getLikes();
  }, []);

  // Handle Like
  const handleLike = async () => {
    if (alreadyLikes) return;

    try {
      await addDoc(collection(firestore, "posts", post.id, "likes"), {
        ownerId: userState.uid,
      });
      setAlreadyLikes(true);
      setLikesNumber((prev) => prev + 1);
    } catch (error) {}
  };

  // Handle toggle comment form
  const handleToggleCommentForm = (e) => {
    if (showCommentForm) {
      e.target.closest("button").style.backgroundColor = "transparent";
    } else {
      e.target.closest("button").style.backgroundColor = "#f2f2f2";
    }
    setShowCommentForm((prev) => !prev);
  };

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
        {userState?.uid === paramsId && (
          <fetcher.Form method="post">
            <button className={classes["delete-btn"]} name={post.id}>
              Delete post
            </button>
          </fetcher.Form>
        )}
        <img
          alt={
            userState?.uid === paramsId
              ? userState?.displayName
              : friend?.displayName
          }
          title={
            userState?.uid === paramsId
              ? userState?.displayName
              : friend?.displayName
          }
          src={
            userState?.uid === paramsId ? userState?.photoURL : friend?.photoURL
          }
        />
        <h3>{post.title}</h3> &nbsp; &#8226; &nbsp;
        <span>{showDate}</span>
      </div>
      <p>{post.content}</p>

      {likesNumber && (
        <div className={classes["likes-wrapper"]}>
          <span className="box-shadow-2">{likesNumber} likes</span>
        </div>
      )}

      <div className={classes["post-actions"]}>
        <div>
          <button
            onClick={handleLike}
            className={alreadyLikes ? classes["already-likes"] : ""}
          >
            <img alt="Like" title="Like" src={like} />
            <span>Like</span>
          </button>
        </div>
        <button onClick={handleToggleCommentForm}>
          <img alt="Comment" title="Comment" src={charBallong} />
          <span>Comment</span>
        </button>
      </div>
      {showCommentForm && (
        <UserCommentForm onCloseCommentForm={setShowCommentForm} id={post.id} />
      )}
      <UserComments id={post.id} />
    </div>
  );
};

export default UserSinglePost;
