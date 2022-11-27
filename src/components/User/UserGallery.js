import { addDoc, collection } from "firebase/firestore";
import { ref, uploadBytes, listAll, getDownloadURL } from "firebase/storage";
import { useContext, useEffect, useRef, useState } from "react";
import { useLoaderData, useFetcher, useParams } from "react-router-dom";
import { AuthContext } from "../../context/auth-context";
import { ImagesContext } from "../../context/images-context";
import { firestore, storage } from "../../firebase-config/config";

import photograph from "./photograph.png";
import classes from "./UserGallery.module.css";
import UserGalleryImage from "./UserGalleryImage";

export async function getGalleryLoader({ params }) {
  const userId = params.id;

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
    return res;
  } catch (error) {
    console.log(error, "UserGallery.js");
  }
}

export async function setGalleryAction({ request, params }) {
  const formData = await request.formData();
  const image = Object.fromEntries(formData);
  const storageRef = ref(storage, "gallery/" + params.id + "/");

  try {
    const imageRef = ref(storageRef, image.image.name);

    await Promise.all([
      await uploadBytes(imageRef, image.image),
      await addDoc(collection(firestore, "images"), {
        id: imageRef.fullPath
          .split("/")
          .pop()
          .split(/\.jpg|\.png/)
          .slice(0, -1)
          .join(""),
        storageRef: imageRef.fullPath,
        ownerId: params.id,
        title: image.title,
      }),
    ]);
  } catch (error) {
    console.log(error, "UserGallery.js");
  }
}

const UserGallery = () => {
  const gallery = useLoaderData();
  const fetcher = useFetcher();

  const [selectedFile, setSelectedFile] = useState("");
  const [imageTitle, setImageTitle] = useState("");

  const imagesContext = useContext(ImagesContext);
  const { user } = useContext(AuthContext);
  const { id: paramsId } = useParams();

  useEffect(() => {
    imagesContext.setImages(gallery);
    setImageTitle("");
    setSelectedFile("");
  }, [gallery, imagesContext]);

  const inputImageRef = useRef(null);
  const handleLabelClick = (e) => {
    if (e.target.files[0] && e.target.files[0].name) {
      setSelectedFile(e.target.files[0].name);
    }
  };

  const handleLabelEnterKey = (e) => {
    if (e.key === "Enter") {
      inputImageRef.current.click();
    }
  };

  return (
    <div className={classes["gallery"]}>
      <div className={classes["gallery-form"]}>
        <h3>Gallery</h3>
        {user?.uid === paramsId && (
          <fetcher.Form encType="multipart/form-data" method="post">
            <label
              className={classes["titleInput-label"]}
              htmlFor={classes["titleInput"]}
            >
              <input
                type="text"
                name="title"
                className="box-shadow-1"
                id={classes["titleInput"]}
                value={imageTitle}
                placeholder="Title of the image"
                onChange={(e) => setImageTitle(e.target.value)}
              />
            </label>
            {selectedFile && (
              <small>
                <strong>Selected file:</strong> {selectedFile}
              </small>
            )}
            <label
              tabIndex="0"
              className={classes["imageInput-label"]}
              htmlFor={classes["fileInput"]}
              onKeyDown={handleLabelEnterKey}
            >
              <img alt="Download" title="Download" src={photograph} />
              <input
                ref={inputImageRef}
                onChange={handleLabelClick}
                id={classes["fileInput"]}
                type="file"
                name="image"
              />
            </label>
            <button type="submit">Upload an image</button>
          </fetcher.Form>
        )}
      </div>

      <div className={classes["gallery-wrapper"]}>
        <div className={`${classes["gallery-wrapper__grid"]} box-shadow-2`}>
          {gallery.length > 0 ? (
            gallery.map((item) => (
              <UserGalleryImage key={item.id} item={item} />
            ))
          ) : (
            <h3>No images in the gallery yet!</h3>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserGallery;
