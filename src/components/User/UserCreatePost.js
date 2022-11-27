import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import { Fragment, useContext, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Form, redirect, useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../context/auth-context";
import { auth, firestore } from "../../firebase-config/config";

export async function createPostAction({ request }) {
  const formData = await request.formData();
  const post = Object.fromEntries(formData);

  try {
    await addDoc(collection(firestore, "posts"), {
      title: post.title,
      content: post.content,
      uid: auth.currentUser.uid,
      dateCreated: serverTimestamp(),
    });

    return redirect("posts");
  } catch (error) {
    console.log(error);
  }
}

const UserCreatePost = () => {
  const navigate = useNavigate();
  const { id: paramsId } = useParams();
  const [userState] = useAuthState(auth);
  const { friend, setFriend } = useContext(AuthContext);

  useEffect(() => {
    async function getUserInfo() {
      try {
        const user = await getDoc(doc(firestore, "users", paramsId));

        if (user.exists()) {
          setFriend(user.data());
        }
      } catch (error) {
        console.log(error, "User.js");
      }
    }
    if (!userState || userState.uid !== paramsId) {
      getUserInfo().then((res) => {
        navigate("posts");
      });
    }
  }, [userState]);

  return (
    <Fragment>
      <div className="form form-wide">
        <h4>Create post</h4>
        <Form method="post">
          <input type="text" name="title" placeholder="Add a title" />
          <textarea
            type="text"
            name="content"
            placeholder="Add a content"
          ></textarea>
          <button type="submit">Save</button>
        </Form>
      </div>
    </Fragment>
  );
};

export default UserCreatePost;
