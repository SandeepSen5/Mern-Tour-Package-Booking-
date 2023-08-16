import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../redux/slices/authSlice'
import agentReducer from '../redux/slices/agent/agentSlice'
import userReducer from '../redux/slices/user/userSlice'

const store = configureStore({
    reducer: {
        auth: authReducer,
        agent: agentReducer,
        user: userReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
    devTools: true
});

export default store;




