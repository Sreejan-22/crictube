import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import VideoCard from "../../components/VideoCard/VideoCard";
import { MdBookmark, MdPlaylistAdd, MdBookmarkBorder } from "react-icons/md";
import { getImgUrl } from "../../utils/getImgUrl";
import { isAuthenticated, getUser } from "../../utils/auth";
import { isAddedToPlaylist } from "../../utils/isAddedToPlaylist";
import "./Video.css";

const main_url = process.env.REACT_APP_BACKEND_URL;

const Video = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const video = location.state.video;
  const [loading, setLoading] = useState(false);
  const [videos, setVideos] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [isAdded, setIsAdded] = useState([]);

  useEffect(() => {
    const url = isAuthenticated()
      ? `${main_url}/alluservideos/${getUser().username}`
      : `${main_url}/videos`;

    setLoading(true);

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const temp = data.videos.filter(
            (item) => item.category === video.category && item._id !== video._id
          );
          setVideos(temp);
          if (isAuthenticated()) {
            setPlaylists(data.playlists);
            setIsAdded(isAddedToPlaylist(temp, data.playlists));
          }
        } else {
          console.log(data.message);
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setLoading(false));

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
            {videos.map((item, index) => (
              <VideoCard
                item={item}
                playlists={playlists}
                isAdded={isAdded[index]}
              />
            ))}
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Video;
