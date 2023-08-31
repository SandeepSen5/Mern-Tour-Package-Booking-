import React from 'react';
import { useState } from 'react';
import { format } from 'date-fns'
import BookingDatatable from '../../../components/Admin/BookingDatatable';
import { useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

export default function AdminBooking() {

    const [orders, setOrders] = useState('');
    const [redirect, setRedirect] = useState(null);
    const { admin } = useSelector((state) => state.auth)
    const [update, setUpdate] = useState(false);

    useEffect(() => {

        if (!admin) {
            setRedirect('/admin/login');
        }

        axios.get(import.meta.env.VITE_ADMIN_AB_GET_ALLORDERS).then(({ data }) => {
            const formattedOrders = data.map((order, index) => (
                {
                    id: index + 1,
                    keyid: order._id,
                    title: order.place.title,
                    guestno: order.guestno,
                    name: order.name,
                    orderstatus: order.orderstatus,
                    date: format(new Date(order.bookin), 'yyyy-MM-dd'),
                    total: order.total,
                    deliverystatus: order.deliverystatus,
                    reason: order.reason,
                }
            ))
            setOrders(formattedOrders)
        })

    }, [update]);
    console.log(orders, "show")
    if (redirect) {
        return <Navigate to={redirect} />;
    }

    return (
        <div>
            <BookingDatatable rows={orders} setUpdate={setUpdate} />

        </div>
    )
}


