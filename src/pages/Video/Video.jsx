import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  videoSelector,
  setVideos,
  setPlaylists,
} from "../../slices/video.slice";
import Layout from "../../components/Layout/Layout";
import VideoCard from "../../components/VideoCard/VideoCard";
import { MdBookmark, MdPlaylistAdd, MdBookmarkBorder } from "react-icons/md";
import { isAuthenticated, getUser } from "../../utils/auth";
import "./Video.css";

const main_url = process.env.REACT_APP_BACKEND_URL;

const Video = () => {
  const location = useLocation();
  const video = isAuthenticated()
    ? location.state.video.videoId
    : location.state.video;

  const [loading, setLoading] = useState(false);
  // const [videos, setVideos] = useState([]);
  const dispatch = useDispatch();
  const { currVideos } = useSelector(videoSelector);

  useEffect(() => {
    const url = isAuthenticated()
      ? `${main_url}/singlevideo/${getUser().username}?category=${
          video.category
        }&currVideoId=${video._id}`
      : `${main_url}/videos/${video.category}?videoId=${video._id}`;

    const headers = isAuthenticated()
      ? {
          "Content-type": "application/json",
          Authorization: `Bearer ${getUser().token}`,
        }
      : { "Content-type": "application/json" };

    setLoading(true);

    fetch(url, {
      headers: headers,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          if (isAuthenticated()) {
            dispatch(setPlaylists(data.userProfile.playlists));
          }
          dispatch(setVideos(data.videos));
          setLoading(false);
        } else {
          setLoading(false);
          alert(data.message);
        }
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  return (
    <Layout>
      {loading ? (
        <div className="loader-container">
          <h1>Loading...</h1>
        </div>
      ) : (
        <div className="single-video-container">
          <div className="iframe-container">
            <iframe
              // width="560"
              // height="315"
              src={video.url}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="video-iframe"
            ></iframe>
            <h2>{video.title}</h2>
            <p>
              <span>by </span>
              {video.channel}
            </p>
            <div className="single-video-icons">
              <div style={{ flexGrow: "1" }}></div>
              <MdBookmarkBorder />
              <MdPlaylistAdd style={{ marginLeft: "1rem" }} />
            </div>
            <hr style={{ borderColor: "gray" }} />
            <h4>{video.description}</h4>
          </div>
          <div className="other-videos-container">
            <h2>Similar Videos</h2>
            {currVideos.map((item) => (
              <VideoCard item={item} key={item._id} />
            ))}
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Video;
