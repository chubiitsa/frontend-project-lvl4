import { createSlice } from '@reduxjs/toolkit';

export const messagesSlice = createSlice({
  name: 'messages',
  initialState: {
    entities: [],
  },
  reducers: {
    load: (state, action) => {
      if (state.entities.length === action.payload.length) {
        return;
      }
      state.entities = [...action.payload];
    },
    add: (state, action) => {
      state.entities = [...state.entities, action.payload];
    },
  },
});

export const { actions } = messagesSlice;

export const selectMessages = (state) => state.messages.entities;

export default messagesSlice.reducer;
