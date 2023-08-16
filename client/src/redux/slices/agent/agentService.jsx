import axios from 'axios';

const login = async (agentData) => {
    const response = await axios.post('/agent/login', agentData);
    if (response.data) {
        console.log(response.data);
        localStorage.setItem('agent', JSON.stringify(response.data))
    }
    return response.data; 
}

const logout = async () => {
    const response = await axios.get('/agent/logout');
    if (response) {
        localStorage.removeItem('agent')  
    }
}

const authService = {
    login,
    logout,
}

export default authService;

