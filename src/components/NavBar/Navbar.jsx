import "./NavBar.css";
import { GiHamburgerMenu } from "react-icons/gi";
import Sidebar from "./Sidebar";
import { useState } from "react";

const Navbar = () => {
  const [sideBar, setSideBar] = useState(false);

  const toggleSideBar = () => {
    setSideBar((prev) => !prev);
  };

  return (
    <nav className="navbar">
      <h1 className="logo">Nebula Poster</h1>
      <GiHamburgerMenu
        size="2em"
        onClick={toggleSideBar}
        className="GiHamburgerMenu"
      />
      <Sidebar sideBar={sideBar} toggleSideBar={toggleSideBar} />
      <div
        className={sideBar ? "backdrop showBackdrop" : "backdrop"}
        onClick={toggleSideBar}
      ></div>
      <ul className="nav-links">
        <li>About</li>
        <li>Login</li>
        <li>Sign Up</li>
      </ul>
    </nav>
  );
};

export default Navbar;
