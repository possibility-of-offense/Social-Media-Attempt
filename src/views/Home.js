import Modal from "../components/UI/Modal";
import HomeUsers from "../components/Home/HomeUsers";
import SkeletonHomeUsers from "../components/Skeletons/SkeletonHomeUsers";
import useFetchUsers from "../hooks/fetchUsers";
import classes from "./styles/Home.module.css";

const Home = () => {
  const { users, loading, error } = useFetchUsers();

  return (
    <div className={`container-lg mt-3 ${classes["home"]}`}>
      <Modal />
      <h1>See some people</h1>
      {loading === true ? (
        <SkeletonHomeUsers />
      ) : (
        !error && <HomeUsers users={users} />
      )}
    </div>
  );
};

export default Home;
