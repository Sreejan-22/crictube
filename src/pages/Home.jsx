import { Link } from "react-router-dom";
import { MdHome, MdBookmark, MdVideoLibrary, MdLogout } from "react-icons/md";
import { FiSearch } from "react-icons/fi";
import "./Home.css";

const Home = () => {
  return (
    <div className="container">
      <div className="sidebar">
        <div className="logo-container">
          <Link to="/">Crictube</Link>
        </div>
        <div className="sidebar-option-container">
          <Link to="/" className="sidebar-option">
            <MdHome />
            <span>Home</span>
          </Link>
          <div className="sidebar-option">
            <FiSearch style={{ position: "relative", top: "2px" }} />
            <span>Search</span>
          </div>
          <div className="sidebar-option">
            <MdBookmark />
            <span>Saved</span>
          </div>
          <div className="sidebar-option">
            <MdVideoLibrary />
            <span>Playlists</span>
          </div>
          <div className="sidebar-option">
            <MdLogout />
            <span>Logout</span>
          </div>
        </div>
      </div>
      <div className="main-content"></div>
    </div>
  );
};

export default Home;
