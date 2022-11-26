import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { Fragment } from "react";
import { Form, redirect } from "react-router-dom";
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
