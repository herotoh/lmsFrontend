import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    username: null,
    roles: [],
  },
  reducers: {
    loginUser: (state, action) => {
      //state.username = action.payload.username;
      //state.roles = action.payload.roles;
      return action.payload; // Save everything from response.data

    },
    logoutUser: () => {
      //state.username = null;
      //state.roles = [];
      return null;
    }
  }
});

export const { loginUser, logoutUser } = userSlice.actions;
export default userSlice.reducer;
