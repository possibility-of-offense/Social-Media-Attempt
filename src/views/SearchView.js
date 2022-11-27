import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import HomeUsers from "../components/Home/HomeUsers";
import useFetchUsers from "../hooks/fetchUsers";

import classes from "./styles/SearchView.module.css";

const SearchView = () => {
  const [foundUsers, setFoundUsers] = useState([]);
  const { users, loading, error, fetchUsersCallback } = useFetchUsers();

  const { value: searchValue } = useParams();

  useEffect(() => {
    if (users.length > 0) {
      const findUsers = users.filter((user) =>
        user.displayName.toLowerCase().includes(searchValue.toLowerCase())
      );
      setFoundUsers(findUsers);
    }
  }, [users, searchValue]);

  console.log("da", foundUsers);

  return (
    <div className={`container-lg mt-3 ${classes["search-view"]}`}>
      <h1>Search view</h1>
      {foundUsers.length > 0 ? (
        <HomeUsers users={foundUsers} />
      ) : (
        <p>No users found</p>
      )}
    </div>
  );
};

export default SearchView;
