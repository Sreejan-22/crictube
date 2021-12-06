import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { videoSelector, setVideosAndPlaylists } from "../../slices/video.slice";
import Layout from "../../components/Layout/Layout";
import VideoCard from "../../components/VideoCard/VideoCard";
import { useToast } from "@chakra-ui/toast";
import { MdBookmark, MdPlaylistAdd, MdBookmarkBorder } from "react-icons/md";
import { isAuthenticated, getUser } from "../../utils/auth";
import "./VideoDetails.css";

const main_url = process.env.REACT_APP_BACKEND_URL;

const Video = () => {
  const location = useLocation();
  const video = location.state.video;

  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { currVideos } = useSelector(videoSelector);
  const toast = useToast();

  const showToast = (title, status = "error") => {
    toast({
      title,
      status,
      duration: 4000,
      position: "top-right",
      isClosable: true,
    });
  };

  useEffect(() => {
    async function load() {
      const url = isAuthenticated()
        ? `${main_url}/uservideos/${getUser().username}?category=${
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

      try {
        const res = await fetch(url, { headers: headers });
        const data = await res.json();

        if (data.success) {
          dispatch(
            setVideosAndPlaylists({
              videos: data.videos,
              playlists: data.playlists,
            })
          );
          setLoading(false);
        } else {
          setLoading(false);
          showToast(data.message);
        }
      } catch (err) {
        setLoading(false);
        showToast("Something went wrong");
      }
    }

    load();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, dispatch]);

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
          <h2 className="other-videos-heading-sm">Similar Videos</h2>
          <div className="other-videos-container">
            <h2>Similar Videos</h2>
            {currVideos.map((item) => (
              <VideoCard video={item} key={item._id} />
            ))}
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Video;
