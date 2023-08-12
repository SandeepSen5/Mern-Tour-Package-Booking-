import * as yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Button from '@mui/material/Button';
import { useSelector, useDispatch } from 'react-redux';
import { useState } from "react";
import axios from "axios";
import { useEffect } from 'react';
import { register, reset } from '../../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import Spinner from '../../components/Admin/spinner';

const userSchema = yup.object().shape({
    email: yup.string().email("Invalid email format").required("Email is required").trim(),
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

export default function LoginPage() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { admin, adminisLoading, adminisError, adminisSuccess, adminmessage } = useSelector((state) => state.auth);

    useEffect(() => {
        if (adminisError) {
            toast.error(adminmessage)
            dispatch(reset());
        }

        if (admin) {
            navigate('/admin')
        }

    }, [admin, adminisError, adminisSuccess, adminmessage, navigate, dispatch])

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

    if (adminisLoading) {
        return <Spinner />
    }

    async function handleLogin(ev) {
        ev.preventDefault();
        try {
            await userSchema.validate({ email, password }, { abortEarly: false });
            const adminData = { email, password }
            dispatch(register(adminData))
            
            
        } catch (error) {
            if (error instanceof yup.ValidationError) {
                const newErrors = {};
                error.inner.forEach(err => {
                    newErrors[err.path] = err.message;
                });
                setErrors(newErrors);
            } else {
                notify("Enter Valid Credential")
            }
        }
    }



    return (
        <div className="mt-20 grow flex items-center justify-around ">
            <div className="mt-20">
                <h1 className="text-4xl text-center mb-4"> #Admin Login</h1>
                <form className="max-w-md mx-auto" onSubmit={handleLogin}>
                    <input type="email" placeholder="Email"
                        value={email}
                        onChange={(ev) => {
                            setEmail(ev.target.value)
                        }} />
                    {errors.email && <div className="text-red-500">{errors.email}</div>}
                    <input type="password" placeholder="Password"
                        value={password}
                        onChange={(ev) => {
                            setPassword(ev.target.value)
                        }} />
                    {errors.password && <div className="text-red-500">{errors.password}</div>}
                    <button className="primary">Login</button>
                    <ToastContainer />
                </form>
            </div>
        </div>
    );
}


