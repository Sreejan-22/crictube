import { useEffect, useState } from "react";
import { useParams } from "react-router";
import Layout from "../../components/Layout/Layout";
import VideoCard from "../../components/VideoCard/VideoCard";
import { useDispatch, useSelector } from "react-redux";
import { videoSelector, setCurrPlaylist } from "../../slices/video.slice";
import { getUser } from "../../utils/auth";
import "./Playlist.css";

const main_url = process.env.REACT_APP_BACKEND_URL;

const Playlist = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { playlists, currPlaylist } = useSelector(videoSelector);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      const url = `${main_url}/singleplaylist/${id}`;

      setLoading(true);
      try {
        const res = await fetch(url, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getUser().token}`,
          },
        });
        const data = await res.json();
        if (data.success) {
          dispatch(
            setCurrPlaylist({
              playlists: data.playlists,
              currPlaylist: data.currPlaylist,
            })
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
  }, []);

  return (
    <Layout>
      {loading ? (
        <h1 style={{ color: "white", fontSize: "1.2rem", textAlign: "center" }}>
          Loading...
        </h1>
      ) : (
        <>
          <h1 className="h1-style">{currPlaylist.name}</h1>
          <br />
          <div className="playlist-video-container">
            {currPlaylist.videos.map((item) => (
              <VideoCard video={item} key={item._id} />
            ))}
          </div>
        </>
      )}
    </Layout>
  );
};

export default Playlist;
