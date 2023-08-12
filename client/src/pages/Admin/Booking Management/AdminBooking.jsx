import { useState } from 'react';
import {format } from 'date-fns'
import BookingDatatable from '../../../components/Admin/BookingDatatable';
import { useEffect } from 'react';
import axios from 'axios';


export default function AdminBoking() {
    const [orders, setOrders] = useState('');
    useEffect(() => {
        axios.get('/admin/allorders').then(({ data }) => {
            const formattedOrders = data.map((order, index) => (
                {
                    id: index + 1,
                    keyid:order._id,
                    title: order.place.title,
                    guestno: order.guestno,
                    name: order.name,
                    orderstatus: order.orderstatus,
                    date:format(new Date(order.bookin), 'yyyy-MM-dd'),
                    total: order.total,
                    deliverystatus: order.deliverystatus,
                    reason: order.reason,
                }
            ))
            setOrders(formattedOrders)
        })

    }, []);

    return (
        <div>
            <BookingDatatable rows={orders} />
        </div>
    )
}


