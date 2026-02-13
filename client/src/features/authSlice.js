import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: null,
    accessToken: null,
    role:null
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            state.user = action.payload.user;
            state.accessToken = action.payload.accessToken;
            state.role=action.payload?.role
        },

        logout: (state) => {
            state.user = null;
            state.accessToken = null;
            state.role=null
        }
    }
});


export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer