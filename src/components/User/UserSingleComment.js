import classes from "./UserSingleComment.module.css";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { deleteDoc, doc } from "firebase/firestore";
import { firestore } from "../../firebase-config/config";

const UserSingleComment = ({ comment, userState, postId }) => {
  const { id } = useParams();

  let isOwner = userState?.uid === id;
  const [showDeleteButton, setShowDeleteButton] = useState(false);

  const handleShowDeleteButton = () => {
    setShowDeleteButton(true);
  };

  const handleHideDeleteButton = () => {
    setShowDeleteButton(false);
  };

  const handleDelete = async (commentId) => {
    try {
      await deleteDoc(doc(firestore, "posts", postId, "comments", commentId));
    } catch (error) {
      console.log(error, "UserSingleComment.js");
    }
  };

  return (
    <div
      onMouseEnter={handleShowDeleteButton}
      onMouseLeave={handleHideDeleteButton}
      className={classes["single-comment"]}
    >
      {isOwner && (
        <div
          onClick={handleDelete.bind(null, comment.id)}
          className={`${classes["single-comment__delete-btn"]} box-shadow-1 ${
            showDeleteButton ? classes["show-btn"] : ""
          }`}
        >
          Remove comment
        </div>
      )}
      <div className={classes["single-comment__image"]}>
        <img
          width="50"
          src={comment.ownerPhoto}
          title={comment.ownerName}
          alt={comment.ownerName}
        />
      </div>
      <div className={classes["single-comment__body"]}>
        <p>{comment.ownerName}</p>

        <div>{comment.content}</div>
      </div>
    </div>
  );
};

export default UserSingleComment;
