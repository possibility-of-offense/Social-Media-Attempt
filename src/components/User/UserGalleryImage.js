import { Link } from "react-router-dom";

const UserGalleryImage = ({ item }) => {
  return (
    <Link to={`${item.id}`}>
      <img alt="Image" src={item.url} />
    </Link>
  );
};

export default UserGalleryImage;
