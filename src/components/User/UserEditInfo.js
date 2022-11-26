import { updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { Form, redirect } from "react-router-dom";
import { auth, firestore } from "../../firebase-config/config";

export async function editInfoAction({ request, params }) {
  const formData = await request.formData();
  const editInfoData = Object.fromEntries(formData);

  await Promise.all([
    updateProfile(auth.currentUser, {
      displayName: editInfoData.nickname,
      photoURL: editInfoData.image,
    }),
    updateDoc(doc(firestore, "users", params.id), {
      displayName: editInfoData.nickname,
      photoURL: editInfoData.image,
      uid: params.id,
    }),
  ]);

  return redirect(`/user/${params.id}`);
}

const UserEditInfo = () => {
  return (
    <div className="form form-wide">
      <h4>Edit Info</h4>
      <Form method="post">
        <input type="text" name="nickname" placeholder="Your nickname" />
        <input type="text" name="image" placeholder="URL to an image" />
        <button type="submit">Update</button>
      </Form>
    </div>
  );
};

export default UserEditInfo;
