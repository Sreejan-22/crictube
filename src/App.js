import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import Home from "./pages/Home.jsx";
import "./App.css";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" element={<Home />} />
      </Switch>
    </Router>
  );
}

export default App;
