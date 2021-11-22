import { useLocation } from "react-router";
import Layout from "../../components/Layout/Layout";
import VideoCard from "../../components/VideoCard/VideoCard";
import "./Playlist.css";

const Playlist = () => {
  const location = useLocation();
  console.log(location.state);

  return (
    <Layout>
      <h1 className="h1-style">{location.state.playlistName}</h1>
      <br />
      <div className="playlist-video-container">
        {location.state.videos.map((item) => (
          <VideoCard item={item} key={item._id} />
        ))}
      </div>
    </Layout>
  );
};

export default Playlist;
