import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { videoSelector, setPlaylists } from "../../slices/video.slice";
import Layout from "../../components/Layout/Layout";
import { useToast } from "@chakra-ui/react";
import { getUser } from "../../utils/auth";
import { getDate } from "../../utils/date";
import "./AllPlaylists.css";

const main_url = process.env.REACT_APP_BACKEND_URL;

const AllPlaylists = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { playlists } = useSelector(videoSelector);
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
    const url = `${main_url}/playlists/${getUser().username}`;

    setLoading(true);
    fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getUser().token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          dispatch(setPlaylists(data.playlists));
          setLoading(false);
        } else {
          setLoading(false);
          showToast(data.message);
        }
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
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
          {playlists.length ? (
            <>
              <h1
                style={{
                  color: "white",
                  fontSize: "1.5rem",
                  fontWeight: "600",
                }}
              >
                Playlists({playlists.length})
              </h1>
              <br />
              <div className="playlist-container">
                {playlists
                  .filter((playlist) => playlist.name !== "Saved")
                  .map((playlist) => (
                    <div className="playlist" key={playlist._id}>
                      <h1 className="playlist-name">{playlist.name}</h1>
                      <h3>
                        {playlist.videos.length} videos &#8226;{" "}
                        {playlist.name === "Saved"
                          ? "Default Playlist"
                          : "User Playlist"}
                      </h3>
                      <h3>Last updated: {getDate(playlist.updatedAt)}</h3>
                      <br />
                      <br />
                      <Link
                        to={`/playlist/${playlist._id}`}
                        state={{ playlist }}
                        className="playlist-link"
                      >
                        View Playlist
                      </Link>
                    </div>
                  ))}
              </div>
            </>
          ) : (
            <h1 className="h1-style">No playlists found</h1>
          )}
        </div>
      )}
    </Layout>
  );
};

export default AllPlaylists;
