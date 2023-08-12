import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from './authService';
//Get user from localstorage
const admin = JSON.parse(localStorage.getItem('admin'))

const initialState = {
    admin: admin ? admin : null,
    adminready: false,
    adminmessage: false,
    adminisSuccess: false,
    adminisError: false,
    adminisLoading: false,
}

export const register = createAsyncThunk('auth/register', async (admin, thunkAPI) => {
    try {
        return await authService.register(admin)
    }
    catch (error) {
        const adminmessage = (error.response && error.response.data && error.
            response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(adminmessage);
    }
})

export const logout = createAsyncThunk('auth/logout', async () => {
    await authService.logout();
})

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        reset: (state) => {
            state.adminready = false
            state.adminisLoading = false
            state.adminisSuccess = false
            state.adminisError = false
            state.adminmessage = ''
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(register.pending, (state) => {
                state.adminisLoading = true
            })
            .addCase(register.fulfilled, (state, action) => {
                state.adminisLoading = false
                state.adminisSuccess = true
                state.adminadmin = action.payload
            })
            .addCase(register.rejected, (state, action) => {
                state.adminisLoading = false
                state.adminisError = true
                state.adminmessage = action.payload
                state.admin = null
            })
    }
})


export const { reset } = authSlice.actions;
export default authSlice.reducer;





