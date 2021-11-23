export const isAddedToPlaylist = (videos, playlists) => {
  const isAdded = [];
  videos.forEach((video) => {
    let temp = [];
    playlists.forEach((playlist) => {
      let flag = playlist.videos.find(
        (item) => String(item._id) === String(video._id)
      )
        ? true
        : false;
      temp.push(flag);
    });
    isAdded.push(temp);
  });

  return isAdded;
};
