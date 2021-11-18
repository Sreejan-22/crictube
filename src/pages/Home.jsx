import { useState, useEffect } from "react";
import Layout from "../components/Layout/Layout";
import { MdBookmark, MdPlaylistAdd, MdBookmarkBorder } from "react-icons/md";
import "./Home.css";
import { getImgUrl } from "../utils/getImgUrl";

const url = process.env.REACT_APP_BACKEND_URL;

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    setLoading(true);

    fetch(`${url}/videos`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          // const currVideos = assignCategory(data.videos);
          // console.log(currVideos);
          setVideos(data.videos);
        } else {
          console.log(data.message);
        }
      })
      .catch((err) => {
        console.log(err);
      })
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
            {videos.map((item) => (
              <div className="video-card" key={item._id}>
                <img src={getImgUrl(item.url)} alt="" />
                <div className="video-description">
                  <h1 title={item.title}>{item.title}</h1>
                  <h3 title={item.channel}>{item.channel}</h3>
                </div>
                <div className="video-icons">
                  <div style={{ flexGrow: "1" }}></div>
                  <MdBookmarkBorder />
                  &nbsp;&nbsp;
                  <MdPlaylistAdd />
                  &nbsp;&nbsp;
                </div>
              </div>
            ))}
          </div>
        )}
      </>
    </Layout>
  );
};

export default Home;
