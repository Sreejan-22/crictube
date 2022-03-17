import { useNavigate } from "react-router-dom";
import { Button } from "@chakra-ui/react";

const LoginNeeded = () => {
  const navigate = useNavigate();

  return (
    <>
      <h1 style={{ textAlign: "center", color: "white", fontSize: "1.2rem" }}>
        Login required!
      </h1>
      <br />
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Button onClick={() => navigate("/login")}>Login</Button>
        &nbsp;&nbsp;&nbsp;
        <Button onClick={() => navigate("/signup")}>Signup</Button>
      </div>
    </>
  );
};

export default LoginNeeded;
