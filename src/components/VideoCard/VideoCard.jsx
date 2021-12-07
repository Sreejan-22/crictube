import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  videoSelector,
  setPlaylists,
  createNewPlaylistFunc,
  addToPlaylist,
  removeFromPlaylist,
} from "../../slices/video.slice";
import AddToPlaylistModal from "../AddToPlaylistModal/AddToPlaylistModal";
import { useDisclosure } from "@chakra-ui/react";
import { Spinner } from "@chakra-ui/spinner";
import { MdBookmark, MdPlaylistAdd, MdBookmarkBorder } from "react-icons/md";
import { getImgUrl } from "../../utils/getImgUrl";
import { isAuthenticated, getUser } from "../../utils/auth";
import { isSaved } from "../../utils/isSaved";
import "./VideoCard.css";

const main_url = process.env.REACT_APP_BACKEND_URL;

const VideoCard = ({ video, showToast }) => {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const dispatch = useDispatch();
  const { playlists } = useSelector(videoSelector);
  const videoData = {
    _id: video._id,
    category: video.category,
    url: video.url,
    title: video.title,
    description: video.description,
    channel: video.channel,
  };

  /* CREATE NEW PLAYLIST */
  const createNewPlaylist = async (playlistName) => {
    const url = `${main_url}/playlists/${getUser().username}`;

    // setNewPlaylistName("");
    dispatch(createNewPlaylistFunc(url, videoData, playlistName, showToast));
  };

  /* ADD TO OR REMOVE VIDEO FROM PLAYLIST */
  const addToOrRemoveFromPlaylist = async (e, id) => {
    if (!e.target.checked) {
      // which means the checkbox has been unchecked just now
      // so remove the video from playlist
      const url = `${main_url}/playlists/remove/${getUser().username}`;

      dispatch(removeFromPlaylist(url, id, video, showToast));
    } else {
      // which means the checkbox has been checked just now
      // so add the video from playlist
      const url = `${main_url}/playlists/add/${getUser().username}`;

      dispatch(addToPlaylist(url, id, videoData, showToast));
    }
  };

  /* SAVE OR UNSAVE A VIDEO */

  const saveVideo = async () => {
    const url = `${main_url}/save/${getUser().username}`;

    setSaving(true);

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
        setSaving(false);
      } else {
        setSaving(false);
        showToast(data.message);
      }
    } catch (err) {
      setSaving(false);
      showToast("Something went wrong");
    }
  };

  const unsaveVideo = async () => {
    const url = `${main_url}/unsave/${getUser().username}`;

    setSaving(true);

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
        setSaving(false);
      } else {
        setSaving(false);
        console.log(data.message);
      }
    } catch (err) {
      setSaving(false);
      console.log(err);
    }
  };

  return (
    <div className="video-card">
      <img
        src={getImgUrl(video.url)}
        alt=""
        onClick={() => {
          navigate(`/video/${video._id}`, {
            state: { video },
          });
        }}
      />
      <Link
        to={`/video/${video._id}`}
        state={{ video }}
        className="video-description"
      >
        <h1 title={video.title}>{video.title}</h1>
        <h3 title={video.channel}>{video.channel}</h3>
      </Link>
      <div className="video-icons">
        <div style={{ flexGrow: "1" }}></div>
        {saving ? (
          <Spinner />
        ) : isSaved(playlists, video._id) ? (
          <MdBookmark
            style={{ color: "white" }}
            onClick={() => {
              if (isAuthenticated()) {
                unsaveVideo(video);
              } else {
                window.alert("Not authenticated");
              }
            }}
          />
        ) : (
          <MdBookmarkBorder
            onClick={() => {
              if (isAuthenticated()) {
                saveVideo(video);
              } else {
                window.alert("Not authenticated");
              }
            }}
          />
        )}
        &nbsp;&nbsp;
        <MdPlaylistAdd
          onClick={() => {
            if (isAuthenticated()) {
              onOpen();
            } else {
              alert("Not authenticated");
            }
          }}
        />
        &nbsp;&nbsp;
      </div>
      <AddToPlaylistModal
        isOpen={isOpen}
        onClose={onClose}
        video={video}
        addToOrRemoveFromPlaylist={addToOrRemoveFromPlaylist}
        createNewPlaylist={createNewPlaylist}
      />
    </div>
  );
};

export default VideoCard;
