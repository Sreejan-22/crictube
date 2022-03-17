import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  videoSelector,
  setVideosAndPlaylists,
  setPlaylists,
  createNewPlaylistFunc,
  addToPlaylist,
  removeFromPlaylist,
} from "../../slices/video.slice";
import AddToPlaylistModal from "../../components/AddToPlaylistModal/AddToPlaylistModal";
import VideoCard from "../../components/VideoCard/VideoCard";
import { Spinner } from "@chakra-ui/spinner";
import { useToast } from "@chakra-ui/toast";
import { useDisclosure } from "@chakra-ui/hooks";
import { MdBookmark, MdPlaylistAdd, MdBookmarkBorder } from "react-icons/md";
import { isAuthenticated, getUser } from "../../utils/auth";
import { isSaved } from "../../utils/isSaved";
import "./VideoDetails.css";

const main_url = process.env.REACT_APP_BACKEND_URL;

const Video = () => {
  const location = useLocation();
  const video = location.state.video;
  const [loading, setLoading] = useState(false);
  const [wait, setWait] = useState(false);
  const dispatch = useDispatch();
  const { currVideos, playlists } = useSelector(videoSelector);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const videoData = {
    _id: video._id,
    category: video.category,
    url: video.url,
    title: video.title,
    description: video.description,
    channel: video.channel,
  };

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

  /* CREATE NEW PLAYLIST */
  const createNewPlaylist = async (playlistName) => {
    const url = `${main_url}/playlists/${getUser().username}`;

    // setNewPlaylistName("");
    dispatch(createNewPlaylistFunc(url, videoData, playlistName, showToast));
  };

  /* ADD TO OR REMOVE VIDEO FROM PLAYLIST */
  const addToOrRemoveFromPlaylist = async (e, id) => {
    if (!e.target.checked) {
      // the checkbox has been unchecked just now
      // so remove the video from playlist
      const url = `${main_url}/playlists/remove/${getUser().username}`;

      dispatch(removeFromPlaylist(url, id, video, showToast));
    } else {
      // the checkbox has been checked just now
      // so add the video from playlist
      const url = `${main_url}/playlists/add/${getUser().username}`;

      dispatch(addToPlaylist(url, id, videoData, showToast));
    }
  };

  /* SAVE OR UNSAVE A VIDEO */

  const saveVideo = async () => {
    const url = `${main_url}/save/${getUser().username}`;

    setWait(true);

    try {
      const res = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${getUser().token}`,
        },
        body: JSON.stringify({
          video: videoData,
        }),
      });
      const data = await res.json();
      if (data.success) {
        dispatch(setPlaylists(data.playlists));
        setWait(false);
        showToast("Video saved", "info");
      } else {
        setWait(false);
        showToast(data.message);
      }
    } catch (err) {
      setWait(false);
      showToast("Something went wrong");
    }
  };

  const unsaveVideo = async () => {
    const url = `${main_url}/unsave/${getUser().username}`;

    setWait(true);

    try {
      const res = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${getUser().token}`,
        },
        body: JSON.stringify({
          videoId: video._id,
        }),
      });
      const data = await res.json();
      if (data.success) {
        dispatch(setPlaylists(data.playlists));
        setWait(false);
        showToast("Video removed from saved playlist", "info");
      } else {
        setWait(false);
        showToast(data.message);
      }
    } catch (err) {
      setWait(false);
      showToast(err);
    }
  };

  return (
    <>
      {loading ? (
        <div className="loader-container">
          <h1>Loading...</h1>
        </div>
      ) : (
        <div className="single-video-container">
          <div className="iframe-container">
            <iframe
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
              {wait ? (
                <Spinner />
              ) : isSaved(playlists, video._id) ? (
                <MdBookmark
                  style={{ color: "white" }}
                  onClick={() => {
                    if (isAuthenticated()) {
                      unsaveVideo();
                    } else {
                      showToast("Login required", "info");
                    }
                  }}
                />
              ) : (
                <MdBookmarkBorder
                  onClick={() => {
                    if (isAuthenticated()) {
                      saveVideo();
                    } else {
                      showToast("Login required", "info");
                    }
                  }}
                />
              )}
              <MdPlaylistAdd
                style={{ marginLeft: "1rem" }}
                onClick={() => {
                  if (isAuthenticated()) {
                    onOpen();
                  } else {
                    showToast("Login required", "info");
                  }
                }}
              />
            </div>
            <hr style={{ borderColor: "gray" }} />
            <h4>{video.description}</h4>
          </div>
          <h2 className="other-videos-heading-sm">Similar Videos</h2>
          <div className="other-videos-container">
            <h2>Similar Videos</h2>
            {currVideos.map((item) => (
              <VideoCard video={item} key={item._id} showToast={showToast} />
            ))}
          </div>
          <AddToPlaylistModal
            isOpen={isOpen}
            onClose={onClose}
            video={video}
            addToOrRemoveFromPlaylist={addToOrRemoveFromPlaylist}
            createNewPlaylist={createNewPlaylist}
          />
        </div>
      )}
    </>
  );
};

export default Video;
