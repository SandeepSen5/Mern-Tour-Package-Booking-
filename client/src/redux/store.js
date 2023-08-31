import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../redux/slices/authSlice';
import agentReducer from '../redux/slices/agent/agentSlice';
import userReducer from '../redux/slices/user/userSlice';
import userReducer1 from '../redux/slices/user/googleSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        agent: agentReducer,
        user: userReducer,
        user: userReducer1,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
    devTools: true
});

export default store;




