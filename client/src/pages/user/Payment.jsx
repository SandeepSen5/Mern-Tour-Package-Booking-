import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useState } from "react";
import { useEffect } from "react";
import { format, isValid } from 'date-fns';
import UserNav from "../../components/User/UserNav";
import { useSelector } from 'react-redux';
import axios from "axios";
import { Navigate, useParams } from "react-router-dom";
import CheckoutForm from "../../components/User/CheckoutForm";

const stripePromise = loadStripe("pk_test_51Nci8ASGZJukKXvUderxBN1Bd6hKdafbxX9xDQo3v6emN6nu2Jvs5leULXV0GFy1OyziysnGvM4Hj5w7u3df7jdw00azWYME7E");

export default function Payment() {

    const { id } = useParams();
    const [clientSecret, setClientSecret] = useState("");
    const [bookingdetails, setBookingdetails] = useState('');
    const [redirect, setRedirect] = useState('');
    const { user } = useSelector((state) => state.user);
    const bookingDate = new Date(bookingdetails.bookin);

    useEffect(() => {
        if (!user) {
            setRedirect('/');
        }
        axios.get('/bookingdetails/' + id).then((response) => {
            setBookingdetails(response.data);
        })
    }, [])

    if (redirect) {
        return <Navigate to={redirect} />;
    }

    async function confirmThis() {
        axios.post(`/create-payment-intent/${id}`, null, { cache: false }).then((response) => {
            console.log(1);
            setClientSecret(response.data.clientSecret)
        })
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
                <div className="bg-white shadow p-4 rounded-2xl">
                    <h1 className="mt-2">Hai {bookingdetails.name}</h1>
                    <h1 className="mt-2">Total Amount:{bookingdetails.guestno}*{bookingdetails.price} </h1>
                    <h2 className="mt-2">No of Guests: {bookingdetails.guestno}</h2>
                    {isValid(bookingDate) && (
                        <h2 className="mt-2">Booking Date On: {format(bookingDate, 'yyyy-MM-dd')}</h2>
                    )}
                    <div>
                        <button onClick={confirmThis} className="primary mt-4"> Confirm Bookings</button>
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
        </div>

    )
}

