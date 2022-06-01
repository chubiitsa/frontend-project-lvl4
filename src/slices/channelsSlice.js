import { createSlice } from '@reduxjs/toolkit';

export const channelsSlice = createSlice({
  name: 'channels',
  initialState: {
    entities: [],
    currentChannelId: null,
  },
  reducers: {
    load(state, action) {
      const { channels, currentChannelId } = action.payload;
      if (state.entities.length === channels.length) {
        return;
      }
      state.entities = [...channels];
      state.currentChannelId = currentChannelId;
    },
    setCurrentChannel(state, action) {
      state.currentChannelId = parseInt(action.payload, 10);
    },
    addChannel(state, action) {
      state.entities = [...state.entities, action.payload];
    },
    rename(state, action) {
      const item = state.entities.find((i) => i.id === action.payload.id);
      item.name = action.payload.name;
    },
    remove(state, action) {
      state.entities = state.entities.filter((i) => i.id !== action.payload.id);
    },
  },
});

export const { actions } = channelsSlice;

export const selectChannels = (state) => state.channels.entities;
export const selectCurrentChannelId = (state) => state.channels.currentChannelId;

export default channelsSlice.reducer;
