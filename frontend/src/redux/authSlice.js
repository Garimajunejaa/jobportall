import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    loading: false,  // Make sure this is false
    user: null
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setUser: (state, action) => {
            state.user = action.payload;
        },
        logout: (state) => {
            state.user = null;
        }
    }
});

export const { setLoading, setUser, logout } = authSlice.actions;
export default authSlice.reducer;