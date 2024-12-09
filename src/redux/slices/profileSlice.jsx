// slices/profileSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userId: null,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setUserId(state, action) {
      state.userId = action.payload;
    },
    clearUserId(state) {
      state.userId = null;
    },
  },
});

export const { setUserId, clearUserId } = profileSlice.actions;
export default profileSlice.reducer;
