import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    currentUser: null,
    apierror: null,
    successMessages : null,
    loading : false,
    filesuploading : false,  
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        clearOldMessages: (state, action) => {
            state.apierror = null;
            state.successMessages = null;
            state.loading = false;
            state.filesuploading = false;
        },
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
        profileUpdateRequest: (state, action) => {
            state.loading = true;
            state.apierror = null;
            state.successMessages = null;
        },
        profileUpdatefailure: (state, action) => {
            state.loading = false;
            state.apierror = action.payload;
            state.successMessages = null;
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
        },
        clearMessages: (state, action) => {
            state.successMessages = null;
            state.apierror = null;
        },
        fileUploading: (state, action) => {
            state.filesuploading = true;
        },
        fileUploadSuccess: (state, action) => {
            state.filesuploading = false;
            state.successMessages = "Files Uploaded Successfully";
        },
        fileUploadFailure: (state, action) => {
            state.filesuploading = false;
            state.apierror = action.payload;
        },
    }
})

export const { signInRequest
    , signInSuccess
    , signInFailure
    , signOut
    ,validationFailure
    ,profileUpdateSucess
    ,profileUpdateRequest
    ,profileUpdatefailure
    ,clearOldMessages
    ,clearMessages
    ,fileUploading
    ,fileUploadSuccess
    ,fileUploadFailure  } = userSlice.actions;
export default userSlice.reducer;