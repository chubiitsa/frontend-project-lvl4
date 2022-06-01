import { createSlice } from '@reduxjs/toolkit';
import { actions as channelActions } from './channelsSlice.js';

export const messagesSlice = createSlice({
  name: 'messages',
  initialState: {
    entities: [],
  },
  reducers: {
    add: (state, action) => {
      state.entities = [...state.entities, action.payload];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(channelActions.load, (state, action) => {
        const { messages } = action.payload;
        state.entities = [...messages];
      })
      .addCase(channelActions.remove, (state, action) => {
        const messages = state.entities.filter((msg) => msg.channelId !== action.payload.id);
        state.entities = [...messages];
      });
  },
});

export const { actions } = messagesSlice;

export const selectMessages = (state) => state.messages.entities;

export default messagesSlice.reducer;
