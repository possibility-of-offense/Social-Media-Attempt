import { collection, query, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { firestore } from "../../firebase-config/config";

const UserComments = ({ id }) => {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    let snapshot;

    const fetchComments = async () => {
      try {
        snapshot = onSnapshot(
          query(collection(firestore, "posts", id, "comments")),
          (snap) => {
            if (snap.docs.length > 0) {
              setComments(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
            }
          }
        );

        console.log(comments);
      } catch (error) {
        console.log(error, "UserComments.js");
      }
    };
    fetchComments();

    return () => snapshot();
  }, []);

  return (
    <section>
      {comments.length > 0 &&
        comments.map((comment) => (
          <div key={comment.id}>
            <p>Author: {comment.ownerName}</p>
            <img width="50" src={comment.ownerPhoto} />
            <div>{comment.content}</div>
          </div>
        ))}
    </section>
  );
};

export default UserComments;
