import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { videoSelector, setUserData, setVideos } from "../slices/video.slice";
import Layout from "../components/Layout/Layout";
import VideoCard from "../components/VideoCard/VideoCard";
import { isAuthenticated, getUser } from "../utils/auth";
import "./Home.css";

const main_url = process.env.REACT_APP_BACKEND_URL;

const Home = () => {
  const [loading, setLoading] = useState(false);
  // const [videos, setVideos] = useState([]);
  const [active, setActive] = useState("all");
  // const [playlists, setPlaylists] = useState([]);
  const videosRef = useRef([]);
  const dispatch = useDispatch();
  const { currVideos } = useSelector(videoSelector);

  useEffect(() => {
    const url = isAuthenticated()
      ? `${main_url}/profile/${getUser().username}`
      : `${main_url}/videos`;

    const headers = isAuthenticated()
      ? {
          "Content-type": "application/json",
          Authorization: `Bearer ${getUser().token}`,
        }
      : {};

    setLoading(true);

    fetch(url, {
      headers: headers,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          console.log(data);
          if (isAuthenticated()) {
            videosRef.current = data.userProfile.allVideos;
            dispatch(
              setUserData({
                videos: data.userProfile.allVideos,
                playlists: data.userProfile.playlists,
              })
            );
          } else {
            videosRef.current = data.videos;
            dispatch(setUserData({ videos: data.videos, playlists: [] }));
          }
          setLoading(false);
        } else {
          setLoading(false);
          console.log(data.message);
        }
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });

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
                    dispatch(setVideos(videosRef.current));
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
                    let temp = [];
                    if (isAuthenticated()) {
                      temp = videosRef.current.filter(
                        (video) => video.videoId.category === "highlights"
                      );
                    } else {
                      temp = videosRef.current.filter(
                        (video) => video.category === "highlights"
                      );
                    }
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
                    let temp = [];
                    if (isAuthenticated()) {
                      temp = videosRef.current.filter(
                        (video) => video.videoId.category === "tutorials"
                      );
                    } else {
                      temp = videosRef.current.filter(
                        (video) => video.category === "tutorials"
                      );
                    }
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
                    let temp = [];
                    if (isAuthenticated()) {
                      temp = videosRef.current.filter(
                        (video) => video.videoId.category === "performances"
                      );
                    } else {
                      temp = videosRef.current.filter(
                        (video) => video.category === "performances"
                      );
                    }
                    dispatch(setVideos(temp));
                  }}
                >
                  Best Performances
                </div>
              </div>
              <div className="video-container">
                {currVideos.map((item) => (
                  <VideoCard item={item} key={item._id} />
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
