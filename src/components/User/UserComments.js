import { collection, query, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { auth, firestore } from "../../firebase-config/config";
import UserSingleComment from "./UserSingleComment";
import { useAuthState } from "react-firebase-hooks/auth";

const UserComments = ({ id }) => {
  const [comments, setComments] = useState([]);
  const [userState] = useAuthState(auth);

  useEffect(() => {
    let snapshot;

    const fetchComments = async () => {
      try {
        snapshot = onSnapshot(
          query(collection(firestore, "posts", id, "comments")),
          (snap) => {
            if (snap.docs.length > 0) {
              setComments(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
            } else {
              setComments([]);
            }
          }
        );
      } catch (error) {
        console.log(error, "UserComments.js");
      }
    };
    fetchComments();

    return () => snapshot();
  }, []);

  return (
    <section className="mt-1-5">
      {comments.length > 0 &&
        comments.map((comment) => (
          <UserSingleComment
            key={comment.id}
            comment={comment}
            userState={userState}
            postId={id}
          />
        ))}
    </section>
  );
};

export default UserComments;
