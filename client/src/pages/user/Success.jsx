import { useEffect } from "react";
import { Navigate, useLocation, } from "react-router-dom";
import UserNav from "../../components/User/UserNav";
import { useSelector } from 'react-redux';
import axios from "axios";
import { useState } from "react";
import Footer from "../../components/User/Footer";

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
                await axios.put(import.meta.env.VITE_USER_SS_ORDERSUCCESS_UPDATE, { payment_intent });
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
        <div className="flex flex-col ">
            <UserNav />
            <div className="mt-10 mb-4 ">
                <h1 className="font-bold text-center ">
                    <span className="bg-green-300 text-3xl px-2 py-1 rounded-full">
                        Payment Successful
                    </span>
                </h1>
            </div>
            <div className="text-center mt-8 text-2xl flex-grow">
                Enjoy Your package!
            </div>
           <div className="mt-80">
           <Footer />
           </div>
        </div>
    );

}

