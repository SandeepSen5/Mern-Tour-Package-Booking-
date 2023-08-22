import * as yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { login } from "../../redux/slices/user/userSlice";
import { useEffect } from 'react';

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
        return Object.values(values).every((value) => value.trim() !== '');
    });

    
export default function LoginPage() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [redirect, setRedirect] = useState(null);
    const [errors, setErrors] = useState({});
    const { user, usermessage } = useSelector((state) => state.user);
    
    const dispatch = useDispatch();
    
    useEffect(() => {
        if (user) {
            setRedirect('/');
        }
    }, [user]);

    useEffect(() => {
        if (usermessage) {
            notify(usermessage);
        }
    }, [usermessage]);

    if (redirect) {
        return <Navigate to={redirect} />;
    }

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

    async function handleLogin(ev) {
        ev.preventDefault();
        try {
            await userSchema.validate({ email, password }, { abortEarly: false });
            const userdata = { email, password };
            dispatch(login(userdata));
            <Navigate to={'/'} />
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
                <h1 className="text-4xl text-center mb-4">Login</h1>
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
                    <div className="text-center py-2 text-gray-500">
                        Don't have an Account?
                        <Link className=" text-black" to={'/register'}>Register Now</Link>
                    </div>
                    <ToastContainer />
                </form>
            </div>
        </div>
    );
}


