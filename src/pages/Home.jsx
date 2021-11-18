import { useState, useEffect } from "react";
import Layout from "../components/Layout/Layout";
import "./Home.css";

const url = process.env.REACT_APP_BACKEND_URL;

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [videos, setVideos] = useState({});

  const assignCategory = (data) => {
    let obj = {
      highlights: [],
      tutorials: [],
      performances: [],
    };

    const temp = [...data];
    obj.highlights = temp.filter((item) => item.category === "highlights");
    obj.highlights.splice(4);
    obj.tutorials = temp.filter((item) => item.category === "tutorials");
    obj.tutorials.splice(4);
    obj.performances = temp.filter((item) => item.category === "performances");
    obj.performances.splice(4);

    return obj;
  };

  useEffect(() => {
    setLoading(true);
    fetch(`${url}/videos`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const currVideos = assignCategory(data.videos);
          setVideos((prev) => currVideos);
        } else {
          console.log(data.message);
        }
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Layout>
      <>
        {loading ? (
          <div className="loader-container">
            <h1>Loading...</h1>
          </div>
        ) : (
          <div className="video-container">
            {[1, 2, 3, 4, 5, 6].map((item, index) => (
              <div className="video-card" key={index}>
                <img
                  src="https://img.youtube.com/vi/jSmfdD4P7yQ/0.jpg"
                  alt=""
                />
                <h1>Ind tour of Aus 2018 Highlights</h1>
                <h3>cricket.com.au</h3>
              </div>
            ))}
          </div>
        )}
      </>
    </Layout>
  );
};

export default Home;
