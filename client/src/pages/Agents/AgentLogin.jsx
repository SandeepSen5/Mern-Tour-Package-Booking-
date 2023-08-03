import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";
import { useContext } from "react";
import { AgentContext } from "../../AgentContext"; 

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [redirect, setRedirect] = useState(false);
    const { setAgent } = useContext(AgentContext)
    async function handleLogin(ev) {
        ev.preventDefault();
        try {
            const { data } =await axios.post('/agent/login', { email, password })
            setAgent(data);
            console.log(data,"data");
            alert('login Success');
            setRedirect(true);
        } catch (e) {
            alert('login failed');
        }
    }
    if (redirect) {
        return <Navigate to={'/agent/profile'} />
    }
    return (
        <div className=" grow flex items-center  justify-around ">
            <div className="-mt-20">
                <h1 className="text-4xl text-center mb-4">Login</h1>
                <form className="max-w-md mx-auto" onSubmit={handleLogin}>
                    <input type="email" placeholder="Email"
                        value={email}
                        onChange={(ev) => {
                            setEmail(ev.target.value)
                        }} />
                    <input type="password" placeholder="Password"
                        value={password}
                        onChange={(ev) => {
                            setPassword(ev.target.value)
                        }} />
                    <button className="primary">Login</button>
                    <div className="text-center py-2 text-gray-500">
                        Don't have an Account?
                        <Link className=" text-black" to={'/agent/register'}>Register Now</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}


