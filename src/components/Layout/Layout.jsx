import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { MdHome, MdBookmark, MdVideoLibrary } from "react-icons/md";
import { FiSearch } from "react-icons/fi";
import { isAuthenticated } from "../../utils/auth";
import "./Layout.css";

const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [active, setActive] = useState("home");
  return (
    <div className="container">
      <div className="sidebar">
        <div className="logo-container">
          <Link to="/">Crictube</Link>
        </div>
        <div className="sidebar-option-container">
          <br />
          <Link
            to="/"
            className={`sidebar-option ${active === "home" ? "active" : ""}`}
            id="active"
            onMouseDown={() => setActive("home")}
          >
            <MdHome />
            <span>Home</span>
          </Link>
          <div
            className={`sidebar-option ${active === "search" ? "active" : ""}`}
            onMouseDown={() => setActive("search")}
          >
            <FiSearch style={{ position: "relative", top: "2px" }} />
            <span>Search</span>
          </div>
          <div
            className={`sidebar-option ${active === "saved" ? "active" : ""}`}
            onMouseDown={() => setActive("saved")}
          >
            <MdBookmark />
            <span>Saved</span>
          </div>
          <div
            className={`sidebar-option ${
              active === "playlists" ? "active" : ""
            }`}
            onMouseDown={() => setActive("playlists")}
          >
            <MdVideoLibrary />
            <span>Playlists</span>
          </div>
        </div>
      </div>
      <div className="top-bar">
        <div className="top-bar-space"></div>
        {isAuthenticated() ? (
          <div
            className="navbar-btn"
            onClick={() => {
              localStorage.removeItem("user");
              if (location.pathname === "/") {
                window.location.reload();
              } else {
                navigate("/");
              }
            }}
          >
            Logout
          </div>
        ) : (
          <>
            <Link to="/login" className="navbar-btn">
              Login
            </Link>
            <Link to="/signup" className="navbar-btn">
              Signup
            </Link>
          </>
        )}
      </div>
      <div className="main-content">{children}</div>
    </div>
  );
};

export default Layout;
