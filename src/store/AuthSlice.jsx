import { createSlice } from '@reduxjs/toolkit';

// const initialState = {
//     isAuthenticated: localStorage.getItem('ticket') ? true : false,
//     user: JSON.parse(localStorage.getItem('user')) || {},
// };
const initialState = {
    isAuthenticated: localStorage.getItem('ticket') ? true : false,
    user: JSON.parse(localStorage.getItem('user')) || {}, // Provide default empty object
};

const authSlice = createSlice({
    name: 'auth',
    initialState: initialState,
    reducers: {
        temp: (state, action) => {
            state.user = action.payload;
            localStorage.setItem('user', JSON.stringify(action.payload));
        },
        login: (state, action) => {
            state.isAuthenticated = true;
            state.user = action.payload;    
            localStorage.setItem('user', JSON.stringify(action.payload.user));
            localStorage.setItem('ticket', JSON.stringify(action.payload.token));
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.user = null;
            localStorage.removeItem('user');
            localStorage.removeItem('ticket');
        },
    },
});

export const { temp, login, logout } = authSlice.actions;
export default authSlice.reducer;
    