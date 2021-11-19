import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import { Input, Button } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import "./Login.css";
import "../Signup/Signup.css";

const url = process.env.REACT_APP_BACKEND_URL;

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const toast = useToast();

  const showToast = (title) => {
    toast({
      title,
      status: "error",
      duration: 4000,
      position: "top-right",
      isClosable: true,
    });
  };

  const login = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${url}/login`, {
        method: "POST",
        body: JSON.stringify({
          email,
          password,
        }),
        headers: {
          "Content-type": "application/json",
        },
      });
      const data = await res.json();
      if (data.success) {
        const userData = {
          username: data.user.username,
          email: email,
          token: data.token,
        };
        localStorage.setItem("user", JSON.stringify(userData));
        setLoading(false);
        navigate("/");
      } else {
        setLoading(false);
        showToast(data.message);
      }
    } catch (err) {
      setLoading(false);
      console.log(err);
      showToast("Failed to login");
    }
  };

  return (
    <Layout>
      <div className="signup-wrapper">
        <form className="signup-container">
          <h1>Login</h1>
          <br />
          <br />
          <h3>Email</h3>
          <Input
            isRequired
            focusBorderColor="#a4a6b3"
            disabled={loading}
            onChange={(e) => setEmail(e.target.value)}
          />
          <br />
          <h3>Password</h3>
          <Input
            type="password"
            isRequired
            focusBorderColor="#a4a6b3"
            disabled={loading}
            onChange={(e) => setPassword(e.target.value)}
          />
          <br />
          <br />
          <Button
            colorScheme="red"
            type="submit"
            isLoading={loading}
            onClick={login}
          >
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
