import { loadStripe } from "@stripe/stripe-js";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Elements } from "@stripe/react-stripe-js";
import { useState } from "react";
import { useEffect } from "react";
import { format, isValid } from 'date-fns';
import UserNav from "../../components/User/UserNav";
import { useSelector } from 'react-redux';
import axios from "axios";
import { Navigate, useParams } from "react-router-dom";
import CheckoutForm from "../../components/User/CheckoutForm";
import Footer from "../../components/User/Footer";
const stripePromise = loadStripe("pk_test_51Nci8ASGZJukKXvUderxBN1Bd6hKdafbxX9xDQo3v6emN6nu2Jvs5leULXV0GFy1OyziysnGvM4Hj5w7u3df7jdw00azWYME7E");

const notify = (msg) => toast.info(msg, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
});

export default function Payment() {

    const { id } = useParams();
    const [clientSecret, setClientSecret] = useState("");
    const [bookingdetails, setBookingdetails] = useState('');
    const [redirect, setRedirect] = useState('');
    const [redirectsucess, setRedirecttosucess] = useState('');
    const { user } = useSelector((state) => state.user);
    const bookingDate = new Date(bookingdetails.bookin);

    useEffect(() => {
        if (!user) {
            setRedirect('/');
        }
        axios.get(import.meta.env.VITE_USER_PM_MYBOOKINGSDETAILS + id).then((response) => {
            setBookingdetails(response.data);
        })
    }, [])

    if (redirect) {
        return <Navigate to={redirect} />;
    }

    async function confirmThis() {
        axios.post(import.meta.env.VITE_USER_PM_MYBOOKINGSORDER_INTENT + `${id}`, null, { cache: false }).then((response) => {
            console.log(1);
            setClientSecret(response.data.clientSecret)
        })
    }
    console.log(clientSecret, "clientSecretclientSecretclientSecretclientSecretclientSecret");
    async function cod() {
        try {
            await axios.post('/codorder/' + `${id}`, null, { cache: false })
            setRedirecttosucess('/sucess');
        }
        catch (err) {
            notify(err.response.data);
        }
    }

    if (redirectsucess) {
        return <Navigate to={redirectsucess} />;
    }

    const appearance = {
        theme: 'stripe',
    };

    const options = {
        clientSecret,
        appearance,
    };

    return (
        <div className="App">
            <UserNav />
            <div className="mt-10 grid grid-cols-1 md:grid-cols-[1fr_2fr]">
                <div className="bg-white shadow p-4 rounded-2xl mx-3">
                    <h1 className="mt-2">Hai {bookingdetails.name}</h1>
                    <h1 className="mt-2">Total Amount:{bookingdetails.guestno}*{bookingdetails.price} </h1>
                    <h2 className="mt-2">No of Guests: {bookingdetails.guestno}</h2>
                    {isValid(bookingDate) && (
                        <h2 className="mt-2">Booking Date On: {format(bookingDate, 'yyyy-MM-dd')}</h2>
                    )}
                    <h2 className="mt-5 font-semibold ">Make Your Payments through</h2>
                    <div className=" flex">
                        <button onClick={confirmThis} className="mt-4 p-2 rounded-2xl"> Online Payments</button>
                    </div>
                    <h2 className="mt-5 font-semibold mx-10">OR</h2>
                    <div className=" flex ">
                        <button onClick={cod} className=" mt-4 p-2 rounded-2xl"> Wallet Purchase</button>
                    </div>
                </div>
                <div>
                    {clientSecret && (
                        <Elements options={options} stripe={stripePromise}>
                            <CheckoutForm />
                        </Elements>
                    )}
                </div>
            </div>
            <ToastContainer />
           <div className="mt-20">
           <Footer />
           </div>
        </div>
    )
}

