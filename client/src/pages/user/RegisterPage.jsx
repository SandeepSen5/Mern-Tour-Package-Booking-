import { Link, Navigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import { useContext } from "react";
import { UserContext } from "../../UserContext";

export default function RegisterPage() {
    const {user} = useContext(UserContext)
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [number, setNumber] = useState('');
    const [password, setPassword] = useState('');
    console.log(name)
    async function registerUser(ev) {
        ev.preventDefault();
        try {
            await axios.post('/register', {
                name, email, number, password
            })
            alert('Registration done');
        }
        catch {
            alert('Registration already done');
        }
    }
    if (user) {
        return <Navigate to={'/'} />
    }
    return (
        <div className="mt-4 grow flex items-center justify-around ">
            <div className="-mt-8">
                <h1 className="text-4xl text-center mb-4">Register</h1>
                <form className="max-w-md mx-auto" onSubmit={registerUser}>
                    <input type="text" placeholder="Name"
                        value={name}
                        onChange={(ev) => setName(ev.target.value)} />
                    <input type="email" placeholder="Email"
                        value={email}
                        onChange={(ev) => setEmail(ev.target.value)} />
                    <input type="text" placeholder="Phone Number"
                        value={number}
                        onChange={(ev) => setNumber(ev.target.value)} />
                    <input type="password" placeholder="Password"
                        value={password}
                        onChange={(ev) => setPassword(ev.target.value)} />
                    <button className="primary">Register</button>
                    <div className="text-center py-2 text-gray-500">
                        Already a Member?
                        <Link className=" text-black" to={'/login'}>Login Now</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}









