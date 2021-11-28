export const isSaved = (playlists, id) => {
  const savedPlaylist = playlists.find((item) => item.name === "Saved");
  if (savedPlaylist) {
    return !!savedPlaylist.videos.find((item) => item._id === id);
  } else {
    return false;
  }
};
