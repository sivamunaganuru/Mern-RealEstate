import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    currentUser: null,
    apierror: null,
    loading : false,  
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        signInRequest: (state, action) => {
            state.loading = true;
            state.apierror = null;
            state.currentUser = null;
        },
        validationFailure: (state, action) => {
            state.loading = false;
            state.apierror = null;
            state.currentUser = null;
        },
        signInSuccess: (state, action) => {
            state.loading = false;
            state.currentUser = action.payload;
            state.apierror = null;
        },
        signInFailure: (state, action) => {
            state.loading = false;
            state.apierror = action.payload;
        },
        signOut: (state, action) => {
            state.currentUser = null;
            state.apierror = null;
        }
    }
})

export const { signInRequest, signInSuccess, signInFailure, signOut,validationFailure } = userSlice.actions;
export default userSlice.reducer;