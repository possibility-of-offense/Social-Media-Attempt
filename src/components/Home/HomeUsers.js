import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase-config/config";
import HomeSingleUser from "./HomeSingleUser";
import classes from "./HomeUsers.module.css";

const HomeUsers = ({ users }) => {
  const [userState] = useAuthState(auth);

  return (
    <div className={`${classes["home-users"]}`}>
      {users.map((user) => (
        <HomeSingleUser key={user.id} user={user} userState={userState} />
      ))}
    </div>
  );
};

export default HomeUsers;
