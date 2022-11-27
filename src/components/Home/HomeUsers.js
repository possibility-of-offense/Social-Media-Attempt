import { useNavigate } from "react-router-dom";
import classes from "./HomeUsers.module.css";

const HomeUsers = ({ users }) => {
  const navigate = useNavigate();

  return (
    <div className={classes["home-users"]}>
      {users.map((user) => (
        <div key={user.id}>
          <img
            src={user.photoURL}
            alt={user.displayName}
            title={user.displayName}
          />
          <h5>{user.displayName}</h5>
          <div>
            <button
              onClick={() => {
                navigate(`/user/${user.id}`);
              }}
            >
              See {user.displayName}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HomeUsers;
