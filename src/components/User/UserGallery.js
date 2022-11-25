import { addDoc, collection } from "firebase/firestore";
import { ref, uploadBytes, listAll, getDownloadURL } from "firebase/storage";
import { useContext, useEffect, useState } from "react";
import { useLoaderData, Form, useFetcher } from "react-router-dom";
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
  const imagesContext = useContext(ImagesContext);

  useEffect(() => {
    imagesContext.setImages(gallery);
  }, []);

  const handleLabelClick = (e) => {
    if (e.target.files[0] && e.target.files[0].name) {
      setSelectedFile(e.target.files[0].name);
    }
  };

  useEffect(() => {
    imagesContext.setImages(gallery);
  }, []);

  return (
    <div className={classes["gallery"]}>
      <div className={classes["gallery-form"]}>
        <h3>Gallery</h3>
        <fetcher.Form encType="multipart/form-data" method="post">
          {selectedFile && (
            <small>
              <strong>Selected file:</strong> {selectedFile}
            </small>
          )}
          <label htmlFor={classes["fileInput"]}>
            <img alt="Download" title="Download" src={photograph} />
            <input
              onChange={handleLabelClick}
              id={classes["fileInput"]}
              type="file"
              name="image"
            />
          </label>
          <button type="submit">Upload an image</button>
        </fetcher.Form>
      </div>

      <div className={classes["gallery-wrapper"]}>
        <div className={`${classes["gallery-wrapper__grid"]} box-shadow-2`}>
          {gallery.length > 0 &&
            gallery.map((item) => (
              <UserGalleryImage key={item.id} item={item} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default UserGallery;
