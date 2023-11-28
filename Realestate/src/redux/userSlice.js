import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    currentUser: null,
    apierror: null,
    successMessages : null,
    loading : false,  
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        signInRequest: (state, action) => {
            state.loading = true;
            state.apierror = null;
            state.successMessages = null;
        },
        validationFailure: (state, action) => {
            state.loading = false;
            state.apierror = null;
            state.successMessages = null;
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
        profileUpdateSucess: (state, action) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.apierror = null;
            state.successMessages = "Profile Updated Successfully";
        },
        signOut: (state, action) => {
            state.currentUser = null;
            state.loading = false;
            state.apierror = null;
        }
    }
})

export const { signInRequest, signInSuccess, signInFailure, signOut,validationFailure,profileUpdateSucess } = userSlice.actions;
export default userSlice.reducer;