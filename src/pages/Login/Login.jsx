import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input, Button } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import "./Login.css";
import "../Signup/Signup.css";

const url = process.env.REACT_APP_BACKEND_URL;

const Login = () => {
  const navigate = useNavigate();
  const initialState = {
    email: "",
    password: "",
    isSubmitting: "",
  };
  const [loginData, setLoginData] = useState(initialState);
  const [guestLoading, setGuestLoading] = useState(false);

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

  const handleInputChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const toggleLoading = (type, value) => {
    if (type === "guest") {
      setGuestLoading(value);
    } else {
      setLoginData({ ...loginData, isSubmitting: value });
    }
  };

  const login = async (isGuestLogin) => {
    const type = isGuestLogin ? "guest" : "user";
    const jsonData = isGuestLogin
      ? {
          email: process.env.REACT_APP_TEST_EMAIL,
          password: process.env.REACT_APP_TEST_PASSWORD,
        }
      : { email: loginData.email, password: loginData.password };

    toggleLoading(type, true);

    try {
      const res = await fetch(`${url}/login`, {
        method: "POST",
        body: JSON.stringify(jsonData),
        headers: {
          "Content-type": "application/json",
        },
      });
      const data = await res.json();
      if (data.success) {
        const userData = {
          username: data.user.username,
          email: data.user.email,
          token: data.token,
        };
        localStorage.setItem("user", JSON.stringify(userData));
        toggleLoading(type, false);
        navigate("/");
      } else {
        toggleLoading(type, false);
        showToast(data.message);
      }
    } catch (err) {
      toggleLoading(type, false);
      showToast("Failed to login");
    }
  };

  return (
    <>
      <div className="signup-wrapper">
        <form
          className="signup-container"
          onSubmit={(e) => {
            e.preventDefault();
            login(false);
          }}
        >
          <h1>Login</h1>
          <br />
          <h3>Email</h3>
          <Input
            type="email"
            name="email"
            isRequired
            focusBorderColor="#a4a6b3"
            disabled={loginData.isSubmitting || guestLoading}
            value={loginData.email}
            onChange={handleInputChange}
          />
          <br />
          <h3>Password</h3>
          <Input
            name="password"
            type="password"
            isRequired
            focusBorderColor="#a4a6b3"
            disabled={loginData.isSubmitting || guestLoading}
            onChange={handleInputChange}
          />
          <br />
          <Button
            colorScheme="red"
            type="submit"
            disabled={guestLoading}
            isLoading={loginData.isSubmitting}
          >
            Submit
          </Button>
          <p style={{ margin: "4px 0px" }}>Or</p>
          <Button
            colorScheme="red"
            disabled={loginData.isSubmitting}
            isLoading={guestLoading}
            onClick={() => login(true)}
          >
            Login with test credentials
          </Button>
          <br />
          <p>
            Not a member? <Link to="/signup">Sign Up</Link>
          </p>
        </form>
      </div>
    </>
  );
};

export default Login;
