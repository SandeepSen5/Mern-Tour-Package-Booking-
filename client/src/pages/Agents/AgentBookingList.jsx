import { Link, Navigate } from "react-router-dom";
import AgentNav from '../../components/Agent/AgentNav';
import { format } from 'date-fns'
import { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

export default function AgentBookingList() {

    const [bookings, setBookings] = useState([]);
    const [redirect, setRedirect] = useState(null);
    const { agent } = useSelector((state) => state.agent);


    useEffect(() => {
        if (!agent) {
            setRedirect('/agent/login');
        }
        axios.get('/agent/userbookings').then((response) => {
            setBookings(response.data);
        })
    }, [agent]);


    if (redirect) {
        return <Navigate to={redirect} />;
    }

    return (
        <div>
            <AgentNav />
            <div className=" mx-auto  mt-8 md:mx-1 md:mt-4">
                {bookings.map(booking => (
                    <div key={booking.id} className="mb-4 p-4 bg-gray-100 rounded-lg">
                        <div className="flex flex-col md:flex-row ">
                            {booking.place?.photos?.length > 0 &&
                                <div className="w-full md:w-48">
                                    <img className="object-cover w-48 h-48  rounded-lg" src={"http://localhost:4000/uploads/" + booking.place.photos[0]} alt="Place" />
                                </div>
                            }
                            <div className="flex flex-col md:flex-row gap-3 md:items-center md:flex-1">
                                <div className="flex-2 ">
                                    <h2 className="text-xl mt-2 md:mt-0">{booking.place.title}</h2>
                                    <h2 className="mt-2">Booking Date: {format(new Date(booking.bookin), 'yyyy-MM-dd')}</h2>
                                    {/* <h2 className="mt-2">No of Guests: {booking.guestno}</h2> */}
                                    <h2 className="mt-2">User Name: {booking.name}</h2>
                                    <h2 className="mt-2">Mobile: {booking.phone}</h2>
                                    <h2 className="mt-2">Total Price: {booking.total}</h2>
                                </div>
                                <div className="mt-4 md:mt-0 md:mx-auto">
                                    <h2 className={`text-2xl md:px-4 py-2 rounded-lg ${booking.deliverystatus == 'Success' ? ' md:bg-green-300' : ' md:bg-gray-400'}`}>
                                        Tour Status: {booking.deliverystatus}
                                    </h2>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
