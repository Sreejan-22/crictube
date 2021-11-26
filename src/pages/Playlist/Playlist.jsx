import { useLocation } from "react-router";
import Layout from "../../components/Layout/Layout";
import VideoCard from "../../components/VideoCard/VideoCard";
import { isAuthenticated } from "../../utils/auth";
import "./Playlist.css";

const Playlist = () => {
  const location = useLocation();

  return (
    <Layout>
      <h1 className="h1-style">{location.state.playlistName}</h1>
      <br />
      <div className="playlist-video-container">
        {location.state.videos.map((item, index) => (
          <VideoCard
            item={isAuthenticated() ? item.videoId : item}
            playlists={location.state.playlists}
            // setPlaylists={() => console.log()}
            playlistsIncluded={isAuthenticated() ? item.playlists : []}
            key={item._id}
          />
        ))}
      </div>
    </Layout>
  );
};

export default Playlist;
