import { createSlice } from '@reduxjs/toolkit';

export const channelsSlice = createSlice({
  name: 'channels',
  initialState: {
    entities: [],
    currentChannel: 'general',
  },
  reducers: {
    load(state, action) {
      if (state.entities.length === action.payload.length) {
        return;
      }
      state.entities = [...state.entities, ...action.payload];
    },
  },
});

export const { actions } = channelsSlice;

export const selectChannels = (state) => state.channels.entities;
export const selectCurrentChannel = (state) => state.channels.currentChannel;

export default channelsSlice.reducer;
