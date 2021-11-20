import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import { MdBookmark, MdPlaylistAdd, MdBookmarkBorder } from "react-icons/md";
import "./Home.css";
import { getImgUrl } from "../utils/getImgUrl";

const url = process.env.REACT_APP_BACKEND_URL;

const Home = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [videos, setVideos] = useState([]);
  const [active, setActive] = useState("all");
  const allVideos = useRef([]);

  useEffect(() => {
    setLoading(true);

    fetch(`${url}/videos`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          allVideos.current = data.videos;
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
          <>
            <div className="wrapper">
              <div className="blank-space"></div>
              <div className="tags-container">
                <div
                  className={`tag ${active === "all" ? "active-tag" : ""}`}
                  onClick={() => {
                    setActive("all");
                    setVideos(allVideos.current);
                  }}
                  style={{ borderRadius: "16px" }}
                >
                  All
                </div>
                <div
                  className={`tag ${
                    active === "highlights" ? "active-tag" : ""
                  }`}
                  onClick={() => {
                    setActive("highlights");
                    const temp = allVideos.current.filter(
                      (item) => item.category === "highlights"
                    );
                    setVideos(temp);
                  }}
                >
                  Highlights
                </div>
                <div
                  className={`tag ${
                    active === "tutorials" ? "active-tag" : ""
                  }`}
                  onClick={() => {
                    setActive("tutorials");
                    const temp = allVideos.current.filter(
                      (item) => item.category === "tutorials"
                    );
                    setVideos(temp);
                  }}
                >
                  Tutorials
                </div>
                <div
                  className={`tag ${
                    active === "performances" ? "active-tag" : ""
                  }`}
                  onClick={() => {
                    setActive("performances");
                    const temp = allVideos.current.filter(
                      (item) => item.category === "performances"
                    );
                    setVideos(temp);
                  }}
                >
                  Best Performances
                </div>
              </div>
              <div className="video-container">
                {videos.map((item) => (
                  <div className="video-card" key={item._id}>
                    <img
                      src={getImgUrl(item.url)}
                      alt=""
                      onClick={() =>
                        navigate(`/video/${item._id}`, {
                          state: { video: item },
                        })
                      }
                    />
                    <Link
                      to={`/video/${item._id}`}
                      state={{ video: item }}
                      className="video-description"
                    >
                      <h1 title={item.title}>{item.title}</h1>
                      <h3 title={item.channel}>{item.channel}</h3>
                    </Link>
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
            </div>
          </>
        )}
      </>
    </Layout>
  );
};

export default Home;
