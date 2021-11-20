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
import Signup from "./pages/Signup/Signup.jsx";
import Login from "./pages/Login/Login.jsx";
import Video from "./pages/Video/Video.jsx";
import Playlist from "./pages/Playlist/Playlist.jsx";
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
          <Route
            path="/playlists/:playlist"
            element={
              <PrivateRoute>
                <Playlist />
              </PrivateRoute>
            }
          ></Route>
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
