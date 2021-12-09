import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import PrivateRoute from "./components/PrivateRoute.jsx";
import Home from "./pages/Home.jsx";
import Layout from "./components/Layout/Layout.jsx";
import LoginNeeded from "./pages/LoginNeeded/LoginNeeded.jsx";
import Signup from "./pages/Signup/Signup.jsx";
import Login from "./pages/Login/Login.jsx";
import Video from "./pages/VideoDetails/VideoDetails.jsx";
import Search from "./pages/Search/Search.jsx";
import AllPlaylists from "./pages/AllPlaylists/AllPlaylists.jsx";
import Playlist from "./pages/Playlist/Playlist.jsx";
import Saved from "./pages/Saved/Saved.jsx";
import "./App.css";
import { isAuthenticated } from "./utils/auth.js";

function ToHome({ children }) {
  return isAuthenticated() ? <Navigate to="/" /> : children;
}

function App() {
  return (
    <ChakraProvider style={{ minHeight: window.innerHeight }}>
      <div className="bg"></div>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="signup"
            element={
              <ToHome>
                <Signup />
              </ToHome>
            }
          />
          <Route
            path="login"
            element={
              <ToHome>
                <Login />
              </ToHome>
            }
          />
          <Route path="video/:id" element={<Video />} />
          <Route path="/search" element={<Search />} />
          <Route
            path="/allplaylists"
            element={isAuthenticated() ? <AllPlaylists /> : <LoginNeeded />}
          />
          <Route
            path="/playlist/:id"
            element={
              <PrivateRoute>
                <Playlist />
              </PrivateRoute>
            }
          />
          <Route
            path="/saved"
            element={isAuthenticated() ? <Saved /> : <LoginNeeded />}
          />
          <Route
            path="*"
            element={
              <Layout>
                <h1
                  style={{
                    textAlign: "center",
                    marginTop: "2rem",
                    fontSize: "2rem",
                    color: "white",
                  }}
                >
                  This page does not exist!!
                </h1>
              </Layout>
            }
          ></Route>
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;
