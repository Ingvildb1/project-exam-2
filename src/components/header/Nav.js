import React from "react";
import { Link } from "react-router-dom";
import "./../../App.css";

const Nav = () => {
  return (
    <div className="nav">
       <h1>Holidaze</h1>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/Login">Login</Link></li>
        <li><Link to="/Register">Register</Link></li>
        <li><Link to="/Profile">Profile</Link></li>
      
      </ul>
    </div>
  );
};

export default Nav;