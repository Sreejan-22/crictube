import { Link } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import { Input, Button } from "@chakra-ui/react";
import "./Login.css";
import "../Signup/Signup.css";

const Login = () => {
  return (
    <Layout>
      <div className="signup-wrapper">
        <form className="signup-container">
          <h1>Login</h1>
          <br />
          <br />
          <h3>Email</h3>
          <Input isRequired focusBorderColor="#a4a6b3" />
          <br />
          <h3>Password</h3>
          <Input type="password" isRequired focusBorderColor="#a4a6b3" />
          <br />
          <br />
          <Button colorScheme="red" type="submit">
            Submit
          </Button>
          <br />
          <p>
            Not a member? <Link to="/signup">Sign Up</Link>
          </p>
        </form>
      </div>
    </Layout>
  );
};

export default Login;
