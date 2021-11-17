import { useState, useEffect } from "react";
import Layout from "../components/Layout/Layout";
import "./Home.css";

const url = process.env.REACT_APP_BACKEND_URL;

const Home = () => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`${url}/videos`)
      .then((res) => res.json())
      .then((data) => console.log(data))
      .catch((err) => console.log(err))
      .finally(
        setTimeout(() => {
          setLoading(false);
        }, 1000)
      );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Layout>
      <>
        {loading ? (
          <div className="loader-container">
            <h1>Loading...</h1>
          </div>
        ) : null}
      </>
    </Layout>
  );
};

export default Home;
