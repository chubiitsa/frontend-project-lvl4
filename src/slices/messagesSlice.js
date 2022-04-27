import { createSlice } from '@reduxjs/toolkit';

export const messagesSlice = createSlice({
  name: 'messages',
  initialState: {
    entities: [],
  },
  reducers: {
    load: (state, action) => {
      state.entities = [...state.entities, ...action.payload];
    },
  },
});

export const { actions } = messagesSlice;

export const selectMessages = (state) => state.messages.entities;

export default messagesSlice.reducer;
