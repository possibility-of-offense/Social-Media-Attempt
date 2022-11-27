import { collection, getDocs, query } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { firestore } from "../firebase-config/config";

const useFetchUsers = (delayFetching = false) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const fetchUsersCallback = async () => {
    setLoading(true);
    try {
      const usersDocs = await getDocs(query(collection(firestore, "users")));

      if (usersDocs.docs.length > 0) {
        const mapped = usersDocs.docs.map((user) => ({
          id: user.id,
          ...user.data(),
        }));

        setUsers(mapped);
        setLoading(false);
      }
    } catch (error) {
      console.log(error, "fetchUsers.js");
      setError(true);
      setLoading(false);
      setUsers([]);
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      if (!delayFetching) {
        fetchUsersCallback();
      }
    };
    fetchUsers();
  }, []);

  return {
    users,
    loading,
    error,
    fetchUsersCallback,
  };
};

export default useFetchUsers;
