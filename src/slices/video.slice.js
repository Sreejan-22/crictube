import { createSlice } from "@reduxjs/toolkit";
import { isAuthenticated, getUser } from "../utils/auth";

const main_url = process.env.REACT_APP_BACKEND_URL;

const initialState = {
  allVideos: [],
  currVideos: [],
  playlists: [],
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
  },
});

// actions
export const { setUserData, setVideos, setPlaylists } = videoSlice.actions;

// selector
export const videoSelector = (state) => state.video;

// reducer
export const videoReducer = videoSlice.reducer;
