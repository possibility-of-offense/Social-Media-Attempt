import { updateProfile } from "firebase/auth";
import { useContext } from "react";
import { Form, redirect } from "react-router-dom";
import { AuthContext } from "../../context/auth-context";
import { auth } from "../../firebase-config/config";
import { removeFromLocalStorage } from "../../helpers/local-storage";

export async function editInfoAction({ request, params }) {
  const formData = await request.formData();
  const editInfoData = Object.fromEntries(formData);

  await updateProfile(auth.currentUser, {
    displayName: editInfoData.nickname,
    photoURL: editInfoData.image,
  });
  removeFromLocalStorage("user");

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
