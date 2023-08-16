import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import agentService from '../agent/agentService';

const agent = JSON.parse(localStorage.getItem('agent'));
 
const initialState = {
    agent: agent ? agent : null,
    agentready: false,
    agentmessage: false,
    agentisSuccess: false, 
    agentisError: false,
    agentisLoading: false,
}

export const login = createAsyncThunk('agent/login', async (agent, thunkAPI) => {
    try {
        return await agentService.login(agent)
    }
    catch (error) {
        const agentmessage =  error.response.data ;
        return thunkAPI.rejectWithValue(agentmessage);
    }
})

export const logout = createAsyncThunk('agent/logout', async () => {
    await agentService.logout();
})

export const agentSlice = createSlice({
    name: 'agent',
    initialState,
    reducers: {
        reset: (state) => {
            state.agent = null
            state.agentready = false
            state.agentisLoading = false
            state.agentisSuccess = false
            state.agentisError = false
            state.agentmessage = ''
            console.log('State after reset:', state)
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.agentisLoading = true
            })
            .addCase(login.fulfilled, (state, action) => {
                state.agentisLoading = false
                state.agentisSuccess = true
                state.agent = action.payload
                state.agentmessage = 'Login Sucess'
            })
            .addCase(login.rejected, (state, action) => {
                state.agentisLoading = false
                state.agentisError = true
                state.agentmessage = action.payload
                state.agent = null
            })
    }
})


export const { reset } = agentSlice.actions;
export default agentSlice.reducer;