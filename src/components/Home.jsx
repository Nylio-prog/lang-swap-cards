import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="Home">
      <Link to="/decks" className="box">
        Decks
      </Link>
      <Link to="/practice" className="box">
        Practice
      </Link>
      <Link to="/friends" className="box">
        Friends
      </Link>
    </div>
  );
};

export default Home;
