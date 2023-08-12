import { useState, useEffect } from "react";
import { format } from 'date-fns'
import axios from 'axios';

export default function BookingList() {
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        axios.get('/mybookings').then((response) => {
            setBookings(response.data);
        })
    }, []);

    return (

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
                                <h2 className="mt-2">No of Guests: {booking.guestno}</h2>
                                <h2 className="mt-2">Total Price: {booking.total}</h2>
                            </div>
                            <div className="mt-4 md:mt-0 md:mx-auto">
                                <h2 className={`text-2xl md:px-4 py-2 rounded-lg ${booking.deliverystatus == 'success' ? ' md:bg-green-300' : ' bg-gray-400'}`}>
                                    Tour Status: {booking.deliverystatus}
                                </h2>
                            </div>
                            <div className="mt-4 md:mt-0 ">
                                {booking.deliverystatus !== 'success' &&
                                    <button className="bg-primary rounded-lg px-4 py-2 text-xl">Cancel Tour</button>
                                }
                                {booking.deliverystatus == 'success' &&
                                    <button className="flex items-center gap-2 bg-green-300 rounded-lg px-4 py-2 text-xl">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
                                        </svg>
                                        Add Review
                                    </button>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}
