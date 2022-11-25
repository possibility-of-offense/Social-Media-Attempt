import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useContext, useEffect } from "react";
import { Form, redirect, useNavigation } from "react-router-dom";
import { AuthContext } from "../../context/auth-context";
import { auth, firestore } from "../../firebase-config/config";
import {
  getFromLocalStorage,
  setLocalStorage,
} from "../../helpers/local-storage";

export async function createPostAction({ request }) {
  const formData = await request.formData();
  const post = Object.fromEntries(formData);

  try {
    const docRef = await addDoc(collection(firestore, "posts"), {
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
  const userLocal = getFromLocalStorage("user");
  const authContext = useContext(AuthContext);

  const navigation = useNavigation();

  useEffect(() => {
    if (!userLocal) {
      if (auth && auth.currentUser) {
        authContext.setUser({
          displayName: auth.currentUser.displayName,
          photoURL: auth.currentUser.photoURL,
          uid: auth.currentUser.uid,
        });
        setLocalStorage("user", authContext.user);
      }
    }
  }, [authContext.user]);

  return (
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
  );
};

export default UserCreatePost;
