import { collection, getDocs, query, where } from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";
import { useContext } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { ImagesContext } from "../context/images-context";
import { firestore, storage } from "../firebase-config/config";
import classes from "./styles/SingleImage.module.css";

export async function singleImageLoader({ params }) {
  const { img } = params;
  const q = await getDocs(
    query(collection(firestore, "images"), where("id", "==", img))
  );
  const imageRef = q.docs.map((el) => ({ id: el.id, ...el.data() }));
  const imageRefUrl = await getDownloadURL(
    ref(storage, imageRef[0].storageRef)
  );

  return {
    url: imageRefUrl,
    ...imageRef[0],
  };
}

const SingleImage = () => {
  const imageData = useLoaderData();
  const imagesContext = useContext(ImagesContext);
  const navigate = useNavigate();

  const handleNextClick = () => {
    const ind = imagesContext.images.findIndex((el) => el.id === imageData.id);
    if (ind < imagesContext.images.length - 1) {
      navigate("/gallery/" + imagesContext.images[ind + 1].id);
    }
  };

  return (
    <div className={classes.images}>
      <div>
        <div className={classes.actions}>
          <button>Prev</button>
          <button onClick={handleNextClick}>Next</button>
        </div>
        <img alt="image" title="image" src={imageData.url} />
      </div>
      <div className={classes["comment-info"]}>Comment info</div>
    </div>
  );
};

export default SingleImage;
