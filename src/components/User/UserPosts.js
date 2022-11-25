import { collection, getDocs, where, query, orderBy } from "firebase/firestore";
import { useLoaderData } from "react-router-dom";
import { firestore } from "../../firebase-config/config";
import UserSinglePost from "./UserSinglePost";

import classes from "./UserPosts.module.css";

export async function userPostsLoader({ params }) {
  const q = query(
    collection(firestore, "posts"),
    where("uid", "==", params.id),
    orderBy("dateCreated")
  );
  const dataSnapshot = await getDocs(q);

  let posts = [];
  dataSnapshot.forEach((doc) => posts.push({ id: doc.id, ...doc.data() }));
  return posts;
}

const UserPosts = () => {
  const postsData = useLoaderData();

  return (
    <div className={classes["user-posts"]}>
      <h3>My posts</h3>
      {postsData.length > 0 &&
        postsData.map((post) => <UserSinglePost key={post.id} post={post} />)}
    </div>
  );
};

export default UserPosts;
