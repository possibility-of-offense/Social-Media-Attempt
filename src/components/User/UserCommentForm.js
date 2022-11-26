import { addDoc, collection } from "firebase/firestore";
import { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore } from "../../firebase-config/config";
import classes from "./UserCommentForm.module.css";

const UserCommentForm = ({ id, onCloseCommentForm }) => {
  const [comment, setComment] = useState("");
  const [userState] = useAuthState(auth);

  const handleComment = async (e) => {
    e.preventDefault();

    try {
      const commentBody = {
        content: comment,
        postId: id,
        ownerId: userState.uid,
        ownerName: userState.displayName
          ? userState.displayName
          : "Unknown soldier",
        ownerPhoto: userState.photoURL ? userState.photoURL : null,
      };

      await addDoc(collection(firestore, "posts", id, "comments"), commentBody);

      setComment("");
      onCloseCommentForm(false);
    } catch (error) {
      console.log(error, "UserCommentForm.js");
    }
  };

  return (
    <form onSubmit={handleComment} className={classes["comment-form"]}>
      <div>
        <h5>Your comment</h5>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Post something cool"
        ></textarea>
        <button>Comment</button>
      </div>
    </form>
  );
};

export default UserCommentForm;
