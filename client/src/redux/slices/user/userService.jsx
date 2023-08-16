import axios from 'axios';

const login = async (userData) => {
    const response = await axios.post('/login', userData);
    if (response.data) {
        console.log(response.data);
        localStorage.setItem('user', JSON.stringify(response.data))
    }
    return response.data; 
}

const logout = async () => {
    const response = await axios.get('/logout');
    if (response) {
        localStorage.removeItem('user')  
    }
}

const userService = {
    login,
    logout,
}

export default userService;
