import axios from 'axios';

const register = async (adminData) => {
    const response = await axios.post('/admin/login', adminData);
    if (response.data) {
        console.log(response.data);
        localStorage.setItem('admin', JSON.stringify(response.data))
    }
    return response.data; 
}

const logout = async () => {
    const response = await axios.get('/admin/logout');
    if (response) {
        localStorage.removeItem('admin')  
    }
}

const authService = {
    register,
    logout,
}

export default authService;

