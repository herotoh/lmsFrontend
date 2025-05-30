// src/store/userSlice.js
import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    token: null,
    username: null,
    roles: [],
  },
  reducers: {
    loginUser: (state, action) => {
      const { token, user } = action.payload;
      state.token = token;
      state.username = user.username;
      state.roles = user.roles || [];
      //return action.payload;
    },
    logoutUser: (state) => {
      state.token = null;
      state.username = null;
      state.roles = [];
     // return null;
    }
  }
});

export const { loginUser, logoutUser } = userSlice.actions;
export default userSlice.reducer;
