import { configureStore } from '@reduxjs/toolkit';
import channels from './slices/channelsSlice.js';
import messages from './slices/messagesSlice.js';

export default configureStore({
  reducer: {
    channels,
    messages,
  },
});
