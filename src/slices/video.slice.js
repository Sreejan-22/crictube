import { createSlice } from "@reduxjs/toolkit";
import { getUser } from "../utils/auth";

const initialState = {
  allVideos: [],
  currVideos: [],
  playlists: [],
  newPlaylistLoading: false,
  addPlaylistLoading: false,
};

const videoSlice = createSlice({
  name: "video",
  initialState,
  reducers: {
    setUserData: (state, { payload }) => {
      const { videos, playlists } = payload;
      state.allVideos = videos;
      state.currVideos = videos;
      state.playlists = playlists;
    },
    setVideos: (state, { payload }) => {
      state.currVideos = payload;
    },
    setPlaylists: (state, { payload }) => {
      state.playlists = payload;
    },
    setVideosAndPlaylists: (state, { payload }) => {
      const { videos, playlists } = payload;
      state.currVideos = videos;
      state.playlists = playlists;
    },
    setNewPlaylistLoading: (state, { payload }) => {
      state.newPlaylistLoading = payload;
    },
    setAddPlaylistLoading: (state, { payload }) => {
      state.addPlaylistLoading = payload;
    },
    addToOrRemovFromePlaylist: (state, { payload }) => {
      state.playlists = payload;
      state.addPlaylistLoading = false;
    },
    createNewPlaylistFinish: (state, { payload }) => {
      state.playlists = payload;
      state.newPlaylistLoading = false;
    },
  },
});

// actions
export const {
  setUserData,
  setVideos,
  setPlaylists,
  setVideosAndPlaylists,
  setNewPlaylistLoading,
  setAddPlaylistLoading,
  addToOrRemovFromePlaylist,
  createNewPlaylistFinish,
} = videoSlice.actions;

// selector
export const videoSelector = (state) => state.video;

// reducer
export const videoReducer = videoSlice.reducer;

// async functions

export function createNewPlaylistFunc(url, videoData, playlistName, showToast) {
  return async (dispatch) => {
    dispatch(setNewPlaylistLoading(true));

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${getUser().token}`,
        },
        body: JSON.stringify({
          video: videoData,
          name: playlistName,
        }),
      });
      const data = await res.json();
      if (data.success) {
        dispatch(createNewPlaylistFinish(data.playlists));
      } else {
        setNewPlaylistLoading(false);
        showToast(data.message);
      }
    } catch (err) {
      setNewPlaylistLoading(false);
      showToast("Something went wrong");
    }
  };
}

export function addToPlaylist(url, id, videoData, showToast) {
  return async (dispatch) => {
    dispatch(setAddPlaylistLoading(true));

    try {
      const res = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${getUser().token}`,
        },
        body: JSON.stringify({
          id,
          video: videoData,
        }),
      });
      const data = await res.json();
      if (data.success) {
        dispatch(addToOrRemovFromePlaylist(data.playlists));
      } else {
        dispatch(setAddPlaylistLoading(false));
        showToast(data.message);
      }
    } catch (err) {
      dispatch(setAddPlaylistLoading(false));
      showToast("Something went wrong");
    }
  };
}

export function removeFromPlaylist(url, id, video, showToast) {
  return async (dispatch) => {
    dispatch(setAddPlaylistLoading(true));

    try {
      const res = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${getUser().token}`,
        },
        body: JSON.stringify({
          videoId: video._id,
          playlistId: id,
        }),
      });
      const data = await res.json();
      if (data.success) {
        dispatch(addToOrRemovFromePlaylist(data.playlists));
      } else {
        dispatch(setAddPlaylistLoading(false));
        showToast(data.message);
      }
    } catch (err) {
      dispatch(setAddPlaylistLoading(false));
      showToast("Something went wrong");
    }
  };
}
