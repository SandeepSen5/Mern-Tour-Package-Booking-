import React, { useState } from 'react';
import { format } from 'date-fns';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Navigate, useParams } from 'react-router-dom';
import jsPDF from 'jspdf';

export default function BillGenerate() {
    const [booking, setBookings] = useState(null);
    const [redirect, setRedirect] = useState(null);
    const { user } = useSelector((state) => state.user);
    const { id } = useParams();

    const generatePdf = () => {
        if (!booking) return;

        const doc = new jsPDF('p', 'pt', 'letter');
        doc.setFontSize(12);

        doc.text('Lets Go Tour Package Bill Report', 40, 20);
        doc.text(`Name: ${booking.name}`, 40, 40);
        doc.text(`Place: ${booking.place.title}`, 40, 60);
        doc.text(`No of Guests: ${booking.guestno}`, 40, 80);
        doc.text(
            `Booking Date: ${format(new Date(booking.bookin), 'yyyy-MM-dd')}`,
            40,
            100
        );
        doc.text(`Total Price: ${booking.total}`, 40, 120);
        doc.text(`Order Method: ${booking.ordermethod}`, 40, 140);
        doc.text(`Payment Status: ${booking.orderstatus}`, 40, 160);

        doc.save('bill_report.pdf');
    };

    React.useEffect(() => {
        if (!user) {
            setRedirect('/');
        }
        axios.get('/bookingbill/' + id).then((response) => {
            setBookings(response.data);
        });
    }, []);

    if (redirect) {
        return <Navigate to={redirect} />;
    }

    return (
        <div>
            {booking && (
                <div className="mx-auto mt-8 md:mx-1 md:mt-4">
                    <div>
                        <div className="flex justify-center mt-5 text-2xl font-semibold">
                            Lets Go Tour Package Bill Report
                        </div>
                        <div className="flex ml-5 mt-10">
                            <div className="flex-2">
                                <h2 className="text-xl mt-2 mb-2 md:mt-0">
                                    Name : {booking.name}
                                </h2>
                                <h2 className=" mt-3 md:mt-0">
                                    Place : {booking.place.title}
                                </h2>
                                <h2 className="mt-2">
                                    No of Guests : {booking.guestno}
                                </h2>
                                <h2 className="mt-2">
                                    Booking Date :{' '}
                                    {format(
                                        new Date(booking.bookin),
                                        'yyyy-MM-dd'
                                    )}
                                </h2>
                                <h2 className="mt-2">
                                    Total Price : {booking.total}
                                </h2>
                                <h2 className="mt-2">
                                    Ordermethod : {booking.ordermethod}
                                </h2>
                                <h2 className="mt-2">
                                    Paymentstatus : {booking.orderstatus}
                                </h2>
                            </div>
                        </div>
                    </div>
                    <button
                        className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        onClick={generatePdf}
                    >
                        Generate PDF
                    </button>
                </div>
            )}
        </div>
    );
}
