import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { videoSelector, setUserData } from "../../slices/video.slice";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  Input,
  Checkbox,
  Stack,
  useDisclosure,
} from "@chakra-ui/react";
import { Spinner } from "@chakra-ui/spinner";
import { MdBookmark, MdPlaylistAdd, MdBookmarkBorder } from "react-icons/md";
import { getImgUrl } from "../../utils/getImgUrl";
import { isAuthenticated, getUser } from "../../utils/auth";
import "./VideoCard.css";

const main_url = process.env.REACT_APP_BACKEND_URL;

const VideoCard = ({ item }) => {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const dispatch = useDispatch();
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const video = isAuthenticated() ? item.videoId : item;

  const saveVideo = () => {
    console.log();
    // setSaving(true)/
  };

  const createNewPlaylist = async (name) => {
    const playlistName = name;
    const url = `${main_url}/newplaylist/${getUser().username}`;
    let video = item.videoId;
    video = {
      _id: video._id,
      category: video.category,
      url: video.url,
      title: video.title,
      description: video.description,
      channel: video.channel,
    };

    setNewPlaylistName("");
    setLoading(true);

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${getUser().token}`,
        },
        body: JSON.stringify({
          video,
          name: playlistName,
        }),
      });
      const data = await res.json();
      if (data.success) {
        dispatch(
          setUserData({
            videos: data.updatedUserProfile.allVideos,
            playlists: data.updatedUserProfile.playlists,
          })
        );
        setLoading(false);
      } else {
        setLoading(false);
        alert(data.message);
      }
    } catch (err) {
      setLoading(false);
      console.log(err);
      alert("Something went wrong");
    }
  };

  const addToOrRemoveFromPlaylist = async (e, id) => {
    if (e.target.checked) {
      // remove from playlist
      const url = `${main_url}/userplaylist/remove/${getUser().username}`;

      setLoading2(true);

      try {
        const res = await fetch(url, {
          method: "PUT",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${getUser().token}`,
          },
          body: JSON.stringify({
            videoId: item.videoId._id,
            playlistId: id,
          }),
        });
        const data = await res.json();
        if (data.success) {
          dispatch(
            setUserData({
              videos: data.updatedUserProfile.allVideos,
              playlists: data.updatedUserProfile.playlists,
            })
          );
          setLoading2(false);
        } else {
          setLoading2(false);
          alert(data.message);
        }
      } catch (err) {
        setLoading2(false);
        console.log(err);
        alert("Something went wrong");
      }
    } else {
      // add to this playlist
      const url = `${main_url}/userplaylist/add/${getUser().username}`;
      let video = item.videoId;
      video = {
        _id: video._id,
        category: video.category,
        url: video.url,
        title: video.title,
        description: video.description,
        channel: video.channel,
      };

      setLoading2(true);

      try {
        const res = await fetch(url, {
          method: "PUT",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${getUser().token}`,
          },
          body: JSON.stringify({
            video: video,
            playlistId: id,
          }),
        });
        const data = await res.json();
        if (data.success) {
          dispatch(
            setUserData({
              videos: data.updatedUserProfile.allVideos,
              playlists: data.updatedUserProfile.playlists,
            })
          );
          setLoading2(false);
        } else {
          setLoading2(false);
          alert(data.message);
        }
      } catch (err) {
        setLoading2(false);
        console.log(err);
        alert("Something went wrong");
      }
    }
  };

  return (
    <div className="video-card">
      <img
        src={getImgUrl(video.url)}
        alt=""
        onClick={() => {
          navigate(`/video/${video._id}`, {
            state: { video: item },
          });
        }}
      />
      <Link
        to={`/video/${video._id}`}
        state={{ video: item }}
        className="video-description"
      >
        <h1 title={video.title}>{video.title}</h1>
        <h3 title={video.channel}>{video.channel}</h3>
      </Link>
      <div className="video-icons">
        <div style={{ flexGrow: "1" }}></div>
        {saving ? (
          <Spinner />
        ) : (
          <MdBookmarkBorder
            onClick={() => {
              if (isAuthenticated()) {
                saveVideo(item);
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
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add to playlist</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack>
              {isAuthenticated()
                ? item.playlists.map((playlist) => (
                    <Checkbox
                      key={playlist._id}
                      onChange={(e) => {
                        addToOrRemoveFromPlaylist(e, playlist._id);
                      }}
                    >
                      {playlist.name}
                    </Checkbox>
                  ))
                : null}
              <br />
              {loading2 ? (
                <>
                  <Spinner />
                  <br />
                </>
              ) : null}
              <Input
                placeholder="Enter playlist name"
                onChange={(e) => setNewPlaylistName(e.target.value)}
              />
              <Button
                colorScheme="blue"
                isLoading={loading}
                onClick={() => createNewPlaylist(newPlaylistName)}
              >
                Create new playlist
              </Button>
            </Stack>
            <br />
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default VideoCard;
