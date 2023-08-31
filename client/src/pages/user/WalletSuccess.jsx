import { useEffect } from "react";
import { Navigate, useLocation, } from "react-router-dom";
import UserNav from "../../components/User/UserNav";
import { useSelector } from 'react-redux';
import { useState } from "react";

export default function WalletSuccess() {

    const { search } = useLocation();
    const params = new URLSearchParams(search);
    const [redirect, setRedirect] = useState('');
    const { user } = useSelector((state) => state.user);
    
    useEffect(() => {
        if (!user) {
            setRedirect('/');
        }

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

