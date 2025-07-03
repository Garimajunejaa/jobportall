import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    applications: [],
    loading: false,
    error: null
};

const applicationSlice = createSlice({
    name: "application",
    initialState,
    reducers: {
        setApplications: (state, action) => {
            state.applications = action.payload;
        },
        setAllApplicants: (state, action) => {
            state.applications = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        }
    }
});

export const { 
    setApplications, 
    setAllApplicants,
    setLoading, 
    setError 
} = applicationSlice.actions;

export default applicationSlice.reducer;