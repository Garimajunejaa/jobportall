import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    allJobs: [],
    filteredJobs: [],
    singleJob: null,  // Add this
    searchedQuery: '',
    searchFilters: {
        location: '',
        jobType: '',
        experienceLevel: '',
        salaryRange: '',
        sortBy: 'relevance'
    }
};

const jobSlice = createSlice({
    name: 'job',
    initialState,
    reducers: {
        setAllJobs: (state, action) => {
            state.allJobs = action.payload;
        },
        setFilteredJobs: (state, action) => {
            state.filteredJobs = action.payload;
        },
        // Add these reducers
        setSearchFilters: (state, action) => {
            state.searchFilters = {
                ...state.searchFilters,
                ...action.payload
            };
        },
        setSearchedQuery: (state, action) => {
            state.searchedQuery = action.payload;
        },
        setAllAdminJobs: (state, action) => {
            state.adminJobs = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        setAllAppliedJobs: (state, action) => {
            state.allAppliedJobs = action.payload;
        },
        setSingleJob: (state, action) => {
            state.singleJob = action.payload;
        },
    }
});

// Export all actions
export const { 
    setSearchedQuery, 
    setSearchFilters, 
    setCurrentJobs,
    setFilteredJobs,
    setAllAppliedJobs,  // Make sure this is included
    setSingleJob,
    setAllJobs,
    setAllAdminJobs,
    setLoading, 
    setError 
} = jobSlice.actions;

export default jobSlice.reducer;