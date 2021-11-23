import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import { useToast } from "@chakra-ui/react";
import { getUser } from "../../utils/auth";
import { getDate } from "../../utils/date";
import { isAddedToPlaylist } from "../../utils/isAddedToPlaylist";
import "./AllPlaylists.css";

const url = process.env.REACT_APP_BACKEND_URL;

const AllPlaylists = () => {
  const [loading, setLoading] = useState(false);
  const [playlists, setPlaylists] = useState([]);
  const toast = useToast();

  const showToast = (title) => {
    toast({
      title,
      status: "error",
      duration: 4000,
      position: "top-right",
      isClosable: true,
    });
  };

  useEffect(() => {
    setLoading(true);
    fetch(`${url}/playlists/${getUser().username}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getUser().token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setPlaylists(data.playlists);
          setLoading(false);
        } else {
          setLoading(false);
          showToast(data.message);
        }
      })
      .catch((err) => {
        setLoading(false);
        showToast("Failed to fetch playlists");
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Layout>
      {loading ? (
        <h1 style={{ color: "white", fontSize: "1.2rem", textAlign: "center" }}>
          Loading...
        </h1>
      ) : (
        <div>
          <h1 style={{ color: "white", fontSize: "1.5rem", fontWeight: "600" }}>
            Playlists({playlists.length})
          </h1>
          <br />
          <div className="playlist-container">
            {playlists.map((item) => (
              <div className="playlist" key={item._id}>
                <h1 className="playlist-name">{item.name}</h1>
                <h3>{item.videos.length} videos &#8226; Default Playlist</h3>
                <h3>Last updated: {getDate(item.updatedAt)}</h3>
                <br />
                <br />
                <Link
                  to={`/playlist/${item._id}`}
                  state={{
                    videos: item.videos,
                    playlistName: item.name,
                    playlists,
                    isAdded: isAddedToPlaylist(item.videos, playlists),
                  }}
                  className="playlist-link"
                >
                  View Playlist
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </Layout>
  );
};

export default AllPlaylists;
