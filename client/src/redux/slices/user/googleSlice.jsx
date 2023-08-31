import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import googleService from "./googleService";
const user = JSON.parse(localStorage.getItem('user'));

const initialState = {
    user: user ? user : null,
    userready: false,
    usermessage: false,
    userisSuccess: false,
    userisError: false,
    userisLoading: false,
}

export const login = createAsyncThunk('user/login', async (user, thunkAPI) => {
    try {
        return await googleService.login(user)
    }
    catch (error) {
        const usermessage =  error.response.data ;
        return thunkAPI.rejectWithValue(usermessage);
    }
})

export const logout = createAsyncThunk('user/logout', async () => {
    await googleService.logout();
})


export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        reset: (state) => {
            state.user = null
            state.userready = false
            state.userisLoading = false
            state.userisSuccess = false
            state.userisError = false
            state.usermessage = ''
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.userisLoading = true
            })
            .addCase(login.fulfilled, (state, action) => {
                state.userisLoading = false
                state.userisSuccess = true
                state.usermessage = 'Login Success'
                state.user= action.payload
            })
            .addCase(login.rejected, (state, action) => {
                state.userisLoading = false
                state.userisError = true
                state.usermessage = action.payload
                state.user = null
            })
    }
})  


export const { reset } = userSlice.actions;
export default userSlice.reducer;


