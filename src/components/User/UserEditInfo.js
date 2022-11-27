import { updateProfile } from "firebase/auth";
import {
  collectionGroup,
  doc,
  getDocs,
  query,
  updateDoc,
} from "firebase/firestore";
import { Form, redirect } from "react-router-dom";
import { auth, firestore } from "../../firebase-config/config";

export async function editInfoAction({ request, params }) {
  const formData = await request.formData();
  const editInfoData = Object.fromEntries(formData);

  const updateName = async () => {
    const comments = await getDocs(
      query(collectionGroup(firestore, "comments"))
    );
    const filter = comments.docs.filter((d) => {
      const data = d.data();

      if (data.ownerId === auth.currentUser.uid) {
        return {
          data,
          ref: d.ref,
        };
      }
    });

    filter.forEach((el) => {
      updateDoc(el.ref, {
        ownerName: editInfoData.nickname,
        ownerPhoto: editInfoData.image,
      });
    });
  };

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
    updateName(),
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
