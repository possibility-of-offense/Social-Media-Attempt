import classes from "./Search.module.css";
import magnifier from "./magnifier.png";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Search = () => {
  const [searchValue, setSearchValue] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (searchValue) {
      setSearchValue("");
      navigate("/search/" + searchValue);
    } else {
      alert("fill something");
    }
  };

  return (
    <form className={`${classes.search}`} onSubmit={handleSubmit}>
      <div>
        <input
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          type="text"
          placeholder="Search..."
        />
        <div className={classes["btn-wrapper"]}>
          <button type="submit">
            <img alt="Search" title="Search" src={magnifier} />
          </button>
        </div>
      </div>
    </form>
  );
};

export default Search;
