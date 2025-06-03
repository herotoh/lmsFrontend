import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
//import loanReducer from './loanSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,    
  }
});
export default store;