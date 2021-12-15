import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import VideoCard from "../../components/VideoCard/VideoCard";
import { useToast } from "@chakra-ui/toast";
import { useDispatch, useSelector } from "react-redux";
import { videoSelector, setPlaylists } from "../../slices/video.slice";
import { getUser } from "../../utils/auth";
import "./Playlist.css";

const main_url = process.env.REACT_APP_BACKEND_URL;

const Playlist = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { playlists } = useSelector(videoSelector);
  const [loading, setLoading] = useState(true);
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
      const url = `${main_url}/singleplaylist/${getUser().username}/${id}`;

      // setLoading(true);
      try {
        const res = await fetch(url, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getUser().token}`,
          },
        });
        const data = await res.json();
        if (data.success) {
          dispatch(setPlaylists(data.playlists));
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
  }, [dispatch, id]);

  return (
    <Layout>
      {loading ? (
        <h1 style={{ color: "white", fontSize: "1.2rem", textAlign: "center" }}>
          Loading...
        </h1>
      ) : (
        <>
          <h1 className="h1-style">
            {playlists.find((item) => item._id === id).name}
          </h1>
          <br />
          <div className="playlist-video-container">
            {playlists
              .find((item) => item._id === id)
              .videos.map((item) => (
                <VideoCard video={item} key={item._id} showToast={showToast} />
              ))}
          </div>
          <br />
          <br />
          <br />
        </>
      )}
    </Layout>
  );
};

export default Playlist;
