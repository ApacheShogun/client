import "./NavBar.css";
import { AiOutlineClose} from 'react-icons/ai'
const Sidebar = ({sideBar, toggleSideBar}) => {
  return (
    <ul className={sideBar ? 'sidebar openSidebar' : 'sidebar'}>
        <AiOutlineClose className="closeSidebar" size='2em' onClick={toggleSideBar}/>
      <li>About</li>
      <li>Login</li>
      <li>Sign Up</li>
    </ul>
  );
};

export default Sidebar;
