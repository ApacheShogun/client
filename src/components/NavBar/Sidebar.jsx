import "./NavBar.css";
import { AiOutlineClose } from "react-icons/ai";
import { Link } from "react-router-dom";

const Sidebar = ({ sideBar, toggleSideBar, logout, user }) => {
  return (
    <ul className={sideBar ? "sidebar openSidebar" : "sidebar"}>
      <AiOutlineClose
        className="closeSidebar"
        size="2em"
        onClick={toggleSideBar}
      />
      <li>About</li>
      {user ? (
        <>
          <li>
            <Link to="/">{user.username}</Link>
          </li>
          <li onClick={() => logout()  }>
            <Link to="/login"> Log out</Link>
          </li>
        </>
      ) : (
        <>
          <li onClick={() => toggleSideBar()}>
            <Link to="/login"> Login</Link>
          </li>
          <li onClick={() => toggleSideBar()}>
            <Link to="/signup"> Sign Up</Link>
          </li>
        </>
      )}
    </ul>
  );
};

export default Sidebar;
