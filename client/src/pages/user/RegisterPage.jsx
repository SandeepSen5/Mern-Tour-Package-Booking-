import * as yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, Navigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import { useContext } from "react";
import { UserContext } from "../../stores/UserContext";

const userSchema = yup.object().shape({
    name: yup.string().required("Name is required").trim(), // Adding .trim() to remove leading/trailing whitespaces
    email: yup.string().email("Invalid email format").required("Email is required").trim(),
    number: yup
        .string()
        .required("Number is required")
        .min(10, "Number must be 10 characters")
        .max(10, "Number can't exceed 10 characters")
        .trim(),
    password: yup
        .string()
        .required("Password is required")
        .min(4, "Password must be at least 4 characters")
        .max(10, "Password can't exceed 10 characters")
        .trim(),
})
    .test('blank-check', 'Please fill out all fields.', (values) => {
        // Check if any of the fields are blank (empty or whitespace-only)
        return Object.values(values).every((value) => value.trim() !== '');
    });


export default function RegisterPage() {
    const notify = (error) => toast.info(error, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
    });
    const { user } = useContext(UserContext);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [number, setNumber] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({}); // State to track validation errors

    console.log(name);

    async function registerUser(ev) {
        ev.preventDefault();
        try {
            await userSchema.validate({ name, email, number, password }, { abortEarly: false });
            await axios.post('/register', {
                name, email, number, password
            });
            notify('Registration Done');
        } catch (error) {
            if (error instanceof yup.ValidationError) {
                const newErrors = {};
                error.inner.forEach(err => {
                    newErrors[err.path] = err.message;
                });
                setErrors(newErrors);
            } else {
                notify(error.response.data);
            }
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
                    {errors.name && <div className="text-red-500">{errors.name}</div>}
                    <input type="email" placeholder="Email"
                        value={email}
                        onChange={(ev) => setEmail(ev.target.value)} />
                    {errors.email && <div className="text-red-500">{errors.email}</div>}
                    <input type="text" placeholder="Phone Number"
                        value={number}
                        onChange={(ev) => setNumber(ev.target.value)} />
                    {errors.number && <div className="text-red-500">{errors.number}</div>}
                    <input type="password" placeholder="Password"
                        value={password}
                        onChange={(ev) => setPassword(ev.target.value)} />
                    {errors.password && <div className="text-red-500">{errors.password}</div>}
                    <button className="primary">Register</button>
                    <div className="text-center py-2 text-gray-500">
                        Already a Member?
                        <Link className=" text-black" to={'/login'}>Login Now</Link>
                        <ToastContainer />
                    </div>
                </form>
            </div>

        </div>
    );
}
