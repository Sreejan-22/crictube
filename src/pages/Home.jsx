import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { videoSelector, setUserData, setVideos } from "../slices/video.slice";
import Layout from "../components/Layout/Layout";
import VideoCard from "../components/VideoCard/VideoCard";
import { isAuthenticated, getUser } from "../utils/auth";
import "./Home.css";

const main_url = process.env.REACT_APP_BACKEND_URL;

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState("all");
  const dispatch = useDispatch();
  const { allVideos, currVideos } = useSelector(videoSelector);

  useEffect(() => {
    async function load() {
      const url = isAuthenticated()
        ? `${main_url}/alluservideos/${getUser().username}`
        : `${main_url}/videos`;

      const headers = isAuthenticated()
        ? {
            "Content-type": "application/json",
            Authorization: `Bearer ${getUser().token}`,
          }
        : {};

      setLoading(true);

      try {
        const res = await fetch(url, { headers: headers });
        const data = await res.json();
        if (data.success) {
          console.log(data);
          dispatch(
            setUserData({ videos: data.videos, playlists: data.playlists })
          );
          setLoading(false);
        } else {
          setLoading(false);
          console.log(data.message);
        }
      } catch (err) {
        setLoading(false);
        console.log(err);
      }
    }

    load();
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
                    dispatch(setVideos(allVideos));
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
                    const temp = allVideos.filter(
                      (video) => video.category === "highlights"
                    );
                    dispatch(setVideos(temp));
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
                    const temp = allVideos.filter(
                      (video) => video.category === "tutorials"
                    );
                    dispatch(setVideos(temp));
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
                    const temp = allVideos.filter(
                      (video) => video.category === "performances"
                    );
                    dispatch(setVideos(temp));
                  }}
                >
                  Best Performances
                </div>
              </div>
              <div className="video-container">
                {currVideos.map((item) => (
                  <VideoCard video={item} key={item._id} />
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
