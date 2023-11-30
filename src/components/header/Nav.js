import React from "react";
import { Link } from "react-router-dom";
import "./../../App.css";

const Nav = () => {
  return (
    <div className="navContainer">
      <div className="topNav">
       <h1 className="navHeader">Holidaze</h1>
       <ul><li><Link to="/Login">Login</Link></li></ul>
       </div>
       <div className="nav">
      <ul>
        <li><Link to="/">Home</Link></li>
        
        <li><Link to="/Profile">Profile</Link></li>
      
      </ul>
    </div>
    </div>
  );
};

export default Nav;