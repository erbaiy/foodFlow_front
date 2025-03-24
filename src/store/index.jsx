import { configureStore } from '@reduxjs/toolkit';
import themeConfigReducer from './themeConfigSlice';
import authReducer from './AuthSlice';
import cartSlice from './cartSlice';
import orderSlice from './orderSlice';
import notificationReducer from './notificationSlice';
import { saveState } from '../utils/localStorage';
import _ from 'lodash';

const store = configureStore({
  reducer: {
    themeConfig: themeConfigReducer,
    auth: authReducer,
    cart : cartSlice,
    order : orderSlice,
    notifications: notificationReducer,

  },
});

let previousCartState = store.getState().cart;

// Subscription 
store.subscribe(() =>{
  const state = store.getState().cart;
  if(! _.isEqual(state,previousCartState && state.items.length > 0)) {
    previousCartState = state;
    saveState('cart',state);
  }
  
})

export default store;
