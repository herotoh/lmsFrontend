// src/store/userSlice.jsx
import { createSlice } from '@reduxjs/toolkit';

// ✅ Load initial state from localStorage (if you still want to persist user info)
const savedUser = JSON.parse(localStorage.getItem('user')) || {
  username: null,
  roles: [],
  token: null, // This 'token' in state will now be the actual JWT string
};

const userSlice = createSlice({
  name: 'user',
  initialState: savedUser, // Use the loaded state
  reducers: {
    loginUser: (state, action) => {
      // Now action.payload will be the LoginResponse object from backend
      const { token, username, roles } = action.payload; // Destructure directly

      // Update state
      state.token = token;
      state.username = username;
      state.roles = roles || [];

      // ✅ Save to localStorage (if you want to persist this info)
      localStorage.setItem('user', JSON.stringify({ token, username, roles }));
    },
    logoutUser: (state) => {
      // ✅ Clear localStorage
      localStorage.removeItem('user');
      state.token = null;
      state.username = null;
      state.roles = [];
    },
  },
});

export const { loginUser, logoutUser } = userSlice.actions;
export default userSlice.reducer;