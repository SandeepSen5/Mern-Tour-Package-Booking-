
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import CheckoutForm from "../../components/User/CheckoutForm";

const stripePromise = loadStripe("pk_test_51Nci8ASGZJukKXvUderxBN1Bd6hKdafbxX9xDQo3v6emN6nu2Jvs5leULXV0GFy1OyziysnGvM4Hj5w7u3df7jdw00azWYME7E");

export default function Payment() {
    const { id } = useParams();
    const [clientSecret, setClientSecret] = useState("");

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
             <button onClick={confirmThis} className="primary mt-4"> Confirm Bookings</button>
            {clientSecret && (
                <Elements options={options} stripe={stripePromise}>
                    <CheckoutForm />
                </Elements>
            )}
        </div>

    )
}

