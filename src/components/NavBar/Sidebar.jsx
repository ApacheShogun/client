import "./NavBar.css";
import { AiOutlineClose } from "react-icons/ai";
import { Link } from "react-router-dom";
import { CgProfile } from "react-icons/cg";


const Sidebar = ({ sideBar, toggleSideBar, logout, user }) => {
  return (
    <ul className={sideBar ? "sidebar openSidebar" : "sidebar"}>
      <AiOutlineClose
        className="closeSidebar"
        size="2em"
        onClick={toggleSideBar}
      />
      {user ? (
        <>
          <li>
          <CgProfile 
                size='1.5em'
                />
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
