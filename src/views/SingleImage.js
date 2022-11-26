import { collection, getDocs, query, where } from "firebase/firestore";
import { getDownloadURL, listAll, ref } from "firebase/storage";
import { useContext, useEffect, useState } from "react";
import { useLoaderData, useNavigate, useParams } from "react-router-dom";
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
  const { id, img } = useParams();
  const [disableNext, setDisableNext] = useState(null);
  const [disablePrev, setDisablePrev] = useState(null);

  useEffect(() => {
    async function fetchImages() {
      const userId = id;

      try {
        const images = await listAll(ref(storage, "gallery/" + userId));

        const urls = images.items.map(async (url) => {
          const urlImg = await getDownloadURL(url);
          return {
            id: url.fullPath
              .split("/")
              .pop()
              .split(/\.jpg|\.png/)
              .slice(0, -1)
              .join(""),
            url: urlImg,
          };
        });
        const res = await Promise.all(urls);
        if ([...res].pop().id === img) {
          setDisableNext(true);
        } else {
          setDisableNext(false);
        }

        if ([...res][0].id === img) {
          setDisablePrev(true);
        } else {
          setDisablePrev(false);
        }

        imagesContext.setImages(res);
      } catch (error) {
        console.log(error, "UserGallery.js");
      }
    }

    fetchImages();
  }, []);

  const handleNextClick = () => {
    const ind = imagesContext.images.findIndex((el) => el.id === imageData.id);

    if (ind < imagesContext.images.length - 1) {
      navigate(`/user/${id}/gallery/${imagesContext.images[ind + 1].id}`);
      setDisableNext(false);
    } else if (ind === imagesContext.images.length - 2) {
      setDisableNext(true);
    }
  };

  const handlePrevClick = () => {
    const ind = imagesContext.images.findIndex((el) => el.id === imageData.id);

    if (ind > 0) {
      navigate(`/user/${id}/gallery/${imagesContext.images[ind - 1].id}`);
      setDisableNext(false);
    } else if (ind === imagesContext.images.length - 2) {
      setDisableNext(true);
    }
  };

  return (
    <div className={classes.images}>
      <div>
        <div
          className={`${classes.actions} ${
            disableNext !== null || disablePrev !== null
              ? classes["show-actions"]
              : ""
          }`}
        >
          <button
            className={disablePrev ? classes["disable"] : ""}
            onClick={handlePrevClick}
          >
            Prev
          </button>
          <button
            className={disableNext ? classes["disable"] : ""}
            onClick={handleNextClick}
          >
            Next
          </button>
        </div>
        <div className={classes["image-wrapper__parent"]}>
          <div className={classes["image-wrapper"]}>
            <img alt="image" title="image" src={imageData.url} />
          </div>
        </div>
      </div>
      <div className={classes["comment-info"]}>{imageData.title}</div>
    </div>
  );
};

export default SingleImage;
