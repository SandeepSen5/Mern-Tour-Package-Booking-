import { useEffect } from "react";
import { Navigate, useLocation, } from "react-router-dom";
import UserNav from "../../components/User/UserNav";
import axios from "axios";
export default function Success() {

    const { search } = useLocation();
    const params = new URLSearchParams(search);
    const payment_intent = params.get('payment_intent');
    console.log(search, "goooooo");

    console.log(payment_intent);

    useEffect(() => {
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

    return (
        <div>
            <UserNav />
            <h1>Payment SucessFull</h1>
        </div>
    )
}

