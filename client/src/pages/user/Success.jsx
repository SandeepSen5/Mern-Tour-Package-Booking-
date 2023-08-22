import { useEffect } from "react";
import { Navigate, useLocation, } from "react-router-dom";
import UserNav from "../../components/User/UserNav";
import { useSelector } from 'react-redux';
import axios from "axios";
import { useState } from "react";

export default function Success() {

    const { search } = useLocation();
    const params = new URLSearchParams(search);
    const [redirect, setRedirect] = useState('');
    const payment_intent = params.get('payment_intent');
    const { user } = useSelector((state) => state.user);
    console.log(search, "goooooo");

    console.log(payment_intent);

    useEffect(() => {
        if (!user) {
            setRedirect('/');
        }
        const makeRequest = async () => {
            try {
                await axios.put('/order', { payment_intent });
                <Navigate to={'/'} />
            }
            catch (e) {
                console.log(e);
            }
        }
        makeRequest();
    }, [])

    if (redirect) {
        return <Navigate to={redirect} />;
    }

    return (
        <div>
            <UserNav />
            <div className="mt-10">
                <h1 className="font-bold text-center ">
                    <span className="bg-green-300 text-3xl px-2 py-1 rounded-full">
                        Payment SucessFull
                    </span>
                </h1>
            </div>
        </div>
    )
}

