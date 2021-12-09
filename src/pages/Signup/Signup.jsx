import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import { Input, Button } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import "./Signup.css";

const url = process.env.REACT_APP_BACKEND_URL;

// export const handleServerError = (message) => {
//   console.log(message);
// };

export const handleSignupError = (errors) => {
  if (errors.email.length) {
    return errors.email;
    // alert(errors.email);
  }

  if (errors.username.length) {
    return errors.username;
  }

  if (errors.password.length) {
    return errors.password;
  }
};

const Signup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
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

  const signup = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${url}/signup`, {
        method: "POST",
        body: JSON.stringify({
          username,
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
          username: username,
          email: email,
          token: data.token,
        };
        localStorage.setItem("user", JSON.stringify(userData));
        setLoading(false);
        navigate("/");
      } else {
        if ("serverError" in data) {
          setLoading(false);
          showToast(data.message);
        } else {
          setLoading(false);
          showToast(handleSignupError(data.errors));
        }
      }
    } catch (err) {
      setLoading(false);
      console.log(err);
      showToast("Failed to sign up");
    }
  };

  return (
    <Layout>
      <div className="signup-wrapper">
        <form className="signup-container">
          <h1>Sign Up</h1>
          <br />
          <br />
          <h3>Username</h3>
          <Input
            isRequired
            focusBorderColor="#a4a6b3"
            disabled={loading}
            onChange={(e) => setUsername(e.target.value)}
          />
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
            onClick={signup}
          >
            Submit
          </Button>
          <br />
          <p>
            Already a member? <Link to="/login">Login</Link>
          </p>
        </form>
      </div>
      <br />
      <br />
      <br />
    </Layout>
  );
};

export default Signup;
