import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <div className="Header">
      <div className="logo">Your Logo</div>

      <div className="nav">
        <Link to="/decks">Decks</Link>
        <Link to="/practice">Practice</Link>
        <Link to="/friends">Friends</Link>
      </div>
    </div>
  );
};

export default Header;
