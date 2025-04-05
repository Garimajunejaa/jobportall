import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        loading: false,
        user: null,
        isAuthenticated: false,
        error: null
    },
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload;
            state.error = null;
        },
        setUser: (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = !!action.payload;
            state.error = null;
        },
        setError: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.error = null;
        }
    }
});
export const { setLoading, setUser, setError, logout } = authSlice.actions;
export default authSlice.reducer;