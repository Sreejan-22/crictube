import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import Home from "./pages/Home.jsx";
import Layout from "./components/Layout/Layout.jsx";
import Signup from "./pages/Signup/Signup.jsx";
import Login from "./pages/Login/Login.jsx";
import "./App.css";

function App() {
  return (
    <ChakraProvider style={{ minHeight: window.innerHeight }}>
      <div className="bg"></div>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="signup" element={<Signup />} />
          <Route path="login" element={<Login />} />
          <Route
            path="*"
            element={
              <Layout>
                <h1
                  style={{
                    textAlign: "center",
                    marginTop: "2rem",
                    fontSize: "2rem",
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
