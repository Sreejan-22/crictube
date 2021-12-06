import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { videoSelector, setPlaylists } from "../../slices/video.slice";
import AddToPlaylistModal from "../AddToPlaylistModal/AddToPlaylistModal";
import { useDisclosure } from "@chakra-ui/react";
import { Spinner } from "@chakra-ui/spinner";
import { MdBookmark, MdPlaylistAdd, MdBookmarkBorder } from "react-icons/md";
import { getImgUrl } from "../../utils/getImgUrl";
import { isAuthenticated, getUser } from "../../utils/auth";
import { isIncludedInArray } from "../../utils/isIncludedInArray";
import { isSaved } from "../../utils/isSaved";
import "./VideoCard.css";

const main_url = process.env.REACT_APP_BACKEND_URL;

const VideoCard = ({ video, showToast }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [saving, setSaving] = useState(false);
  const [newPlaylistLoading, setNewPlaylistLoading] = useState(false);
  const [addPlaylistLoading, setAddPlaylistLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const dispatch = useDispatch();
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const { playlists } = useSelector(videoSelector);

  /* CREATE NEW PLAYLIST */
  const createNewPlaylist = async (name) => {
    if (!name.length) {
      return;
    }
    const playlistName = name;
    const url = `${main_url}/playlists/${getUser().username}`;
    let videoData = {
      _id: video._id,
      category: video.category,
      url: video.url,
      title: video.title,
      description: video.description,
      channel: video.channel,
    };

    setNewPlaylistName("");
    setNewPlaylistLoading(true);

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${getUser().token}`,
        },
        body: JSON.stringify({
          video: videoData,
          name: playlistName,
        }),
      });
      const data = await res.json();
      if (data.success) {
        dispatch(setPlaylists(data.playlists));
        setNewPlaylistLoading(false);
      } else {
        setNewPlaylistLoading(false);
        showToast(data.message);
      }
    } catch (err) {
      setNewPlaylistLoading(false);
      showToast("Something went wrong");
    }
  };

  /* ADD TO OR REMOVE VIDEO FROM PLAYLIST */
  const addToOrRemoveFromPlaylist = async (e, id) => {
    if (!e.target.checked) {
      // which means the checkbox has been unchecked just now
      // so remove the video from playlist
      const url = `${main_url}/playlists/remove/${getUser().username}`;

      setAddPlaylistLoading(true);

      try {
        const res = await fetch(url, {
          method: "PUT",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${getUser().token}`,
          },
          body: JSON.stringify({
            videoId: video._id,
            playlistId: id,
          }),
        });
        const data = await res.json();
        if (data.success) {
          if (location.pathname.includes("/playlist/")) {
            onClose();
          }
          dispatch(setPlaylists(data.playlists));
          setAddPlaylistLoading(false);
        } else {
          setAddPlaylistLoading(false);
          showToast(data.message);
        }
      } catch (err) {
        setAddPlaylistLoading(false);
        showToast("Something went wrong");
      }
    } else {
      // which means the checkbox has been checked just now
      // so add the video from playlist
      const url = `${main_url}/playlists/add/${getUser().username}`;
      let videoData = {
        _id: video._id,
        category: video.category,
        url: video.url,
        title: video.title,
        description: video.description,
        channel: video.channel,
      };

      setAddPlaylistLoading(true);

      try {
        const res = await fetch(url, {
          method: "PUT",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${getUser().token}`,
          },
          body: JSON.stringify({
            id,
            video: videoData,
          }),
        });
        const data = await res.json();
        if (data.success) {
          dispatch(setPlaylists(data.playlists));
          setAddPlaylistLoading(false);
        } else {
          setAddPlaylistLoading(false);
          showToast(data.message);
        }
      } catch (err) {
        setAddPlaylistLoading(false);
        showToast("Something went wrong");
      }
    }
  };

  /* SAVE OR UNSAVE A VIDEO */

  const saveVideo = async () => {
    const url = `${main_url}/save/${getUser().username}`;
    let videoData = {
      _id: video._id,
      category: video.category,
      url: video.url,
      title: video.title,
      description: video.description,
      channel: video.channel,
    };

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
        playlists={playlists}
        newPlaylistLoading={newPlaylistLoading}
        addPlaylistLoading={addPlaylistLoading}
        isIncludedInArray={isIncludedInArray}
        addToOrRemoveFromPlaylist={addToOrRemoveFromPlaylist}
        newPlaylistName={newPlaylistName}
        setNewPlaylistName={setNewPlaylistName}
        createNewPlaylist={createNewPlaylist}
      />
    </div>
  );
};

export default VideoCard;
