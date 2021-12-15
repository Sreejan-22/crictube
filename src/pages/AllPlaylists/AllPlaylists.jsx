import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { videoSelector, setPlaylists } from "../../slices/video.slice";
import Layout from "../../components/Layout/Layout";
import LoginNeeded from "../LoginNeeded/LoginNeeded";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useToast } from "@chakra-ui/react";
import { getUser, isAuthenticated } from "../../utils/auth";
import { getDate } from "../../utils/date";
import "./AllPlaylists.css";

const main_url = process.env.REACT_APP_BACKEND_URL;

const AllPlaylists = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { playlists } = useSelector(videoSelector);
  const toast = useToast();

  const showToast = (title, status) => {
    toast({
      title,
      status,
      duration: 4000,
      position: "top-right",
      isClosable: true,
    });
  };

  useEffect(() => {
    if (isAuthenticated()) {
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
            showToast(data.message, "error");
          }
        })
        .catch((err) => {
          setLoading(false);
          console.log(err);
          showToast("Failed to fetch playlists", "error");
        });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const deletePlaylist = async (id) => {
    const url = `${main_url}/playlists/${getUser().username}/${id}`;

    try {
      const res = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getUser().token}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        dispatch(setPlaylists(data.playlists));
        showToast(data.message, "info");
      } else {
        showToast(data.message, "error");
      }
    } catch (err) {
      showToast("Failed to delete playlists", "error");
    }
  };

  return (
    <>
      {isAuthenticated() ? (
        <Layout>
          {loading ? (
            <h1
              style={{
                color: "white",
                fontSize: "1.2rem",
                textAlign: "center",
              }}
            >
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
                    Playlists
                  </h1>
                  <br />
                  <div className="playlist-container">
                    {playlists
                      .filter((playlist) => playlist.name !== "Saved")
                      .map((playlist) => (
                        <div className="playlist" key={playlist._id}>
                          <h1 className="playlist-name">{playlist.name}</h1>
                          <h3>{playlist.videos.length} video(s)</h3>
                          <h3>Last updated: {getDate(playlist.updatedAt)}</h3>
                          <br />
                          <br />
                          <div>
                            <Link
                              to={`/playlist/${playlist._id}`}
                              className="playlist-link"
                            >
                              View Playlist
                            </Link>
                            <RiDeleteBin6Line
                              style={{
                                color: "rgb(255, 60, 38)",
                                fontSize: "1.2rem",
                                cursor: "pointer",
                              }}
                              onClick={() => deletePlaylist(playlist._id)}
                            />
                          </div>
                        </div>
                      ))}
                  </div>
                  <br />
                  <br />
                  <br />
                </>
              ) : (
                <h1 className="h1-style">No playlists found</h1>
              )}
            </div>
          )}
        </Layout>
      ) : (
        <LoginNeeded />
      )}
    </>
  );
};

export default AllPlaylists;
