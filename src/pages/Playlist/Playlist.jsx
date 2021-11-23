import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import Layout from "../../components/Layout/Layout";
import VideoCard from "../../components/VideoCard/VideoCard";
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
            item={item}
            key={item._id}
            playlists={location.state.playlists}
            isAdded={location.state.isAdded[index]}
          />
        ))}
      </div>
    </Layout>
  );
};

export default Playlist;
