import { createSlice } from '@reduxjs/toolkit';

export const channelsSlice = createSlice({
  name: 'channels',
  initialState: {
    entities: [],
  },
  reducers: {
    load(state, action) {
      state.entities = [...state.entities, ...action.payload];
    },
  },
});

export const { actions } = channelsSlice;

export const selectChannels = (state) => state.channels.entities;

export default channelsSlice.reducer;
