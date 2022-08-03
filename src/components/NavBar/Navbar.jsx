import "./NavBar.css";
import { GiHamburgerMenu } from "react-icons/gi";
import Sidebar from "./Sidebar";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";

const Navbar = () => {
  const [sideBar, setSideBar] = useState(false);
  const { user, dispatch } = useAuthContext();

  const toggleSideBar = () => {
    setSideBar((prev) => !prev);
  };

  const logout = () => {
    // remove user from storage
    localStorage.removeItem('user')

    // dispatch logout action
    dispatch({ type: 'LOGOUT' })
  }

  return (
    <div className="nav-container">
      <nav className="navbar">
        <h1 className="logo">
          {" "}
          <Link to="/">Nebula Poster</Link>{" "}
        </h1>
        <GiHamburgerMenu
          size="2em"
          onClick={toggleSideBar}
          className="GiHamburgerMenu"
        />
        <Sidebar sideBar={sideBar} toggleSideBar={toggleSideBar} logout={logout} user={user}/>
        <div
          className={sideBar ? "backdrop showBackdrop" : "backdrop"}
          onClick={toggleSideBar}
        ></div>

        <ul className="nav-links">
          <li>About</li>
          {user ? (
            <>
              <li>
                <Link to="/">{user.username}</Link>
              </li>
              <li onClick={logout}>
                <Link to="/login"> Log out</Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login"> Login</Link>
              </li>
              <li>
                <Link to="/signup"> Sign Up</Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
