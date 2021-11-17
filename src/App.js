import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import Home from "./pages/Home.jsx";
import "./App.css";

function App() {
  return (
    <ChakraProvider>
      <div className="bg"></div>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="*"
            element={
              <div>
                <h1 style={{ textAlign: "center", marginTop: "2rem" }}>
                  This page does not exist!!
                </h1>
              </div>
            }
          ></Route>
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;
