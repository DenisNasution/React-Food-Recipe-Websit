import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  useEffect(() => {
    document.title = "Not Found-Recipe of World";
  }, []);
  return (
    <div className='recipeDetail mainWrapper'>
      <div className='' style={{ textAlign: "center" }}>
        <h1>PAGE NOT FOUND</h1>
        <Link to={"/"}>Back to Home</Link>
      </div>
    </div>
  );
};

export default NotFound;
