import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPlaylists, videoSelector } from "../../slices/video.slice";
import LoginNeeded from "../LoginNeeded/LoginNeeded";
import VideoCard from "../../components/VideoCard/VideoCard";
import { useToast } from "@chakra-ui/toast";
import { getUser, isAuthenticated } from "../../utils/auth";
import "./Saved.css";

const main_url = process.env.REACT_APP_BACKEND_URL;

const Saved = () => {
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const dispatch = useDispatch();
  const { playlists } = useSelector(videoSelector);

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
    if (isAuthenticated()) {
      async function load() {
        const url = `${main_url}/saved/${getUser().username}`;

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
            dispatch(setPlaylists(data.playlists));
            setLoading(false);
          } else {
            setLoading(false);
            showToast(data.message);
          }
        } catch (err) {
          setLoading(false);
          showToast("Something went wrong!");
        }
      }

      load();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  return (
    <>
      {isAuthenticated() ? (
        <>
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
            <>
              <h1 className="h1-style">
                {playlists.find((item) => item.name === "Saved").name}
              </h1>
              <br />
              <div className="playlist-video-container">
                {playlists
                  .find((item) => item.name === "Saved")
                  .videos.map((item) => (
                    <VideoCard
                      video={item}
                      key={item._id}
                      showToast={showToast}
                    />
                  ))}
              </div>
              <br />
              <br />
              <br />
            </>
          )}
        </>
      ) : (
        <LoginNeeded />
      )}
    </>
  );
};

export default Saved;
