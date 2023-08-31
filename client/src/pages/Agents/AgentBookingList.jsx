import { Link, Navigate } from "react-router-dom";
import AgentNav from '../../components/Agent/AgentNav';
import { format } from 'date-fns'
import { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import AgentBookingDatatable from "../../components/Agent/AgentBookingDatatable";
export default function AgentBookingList() {


    const [orders, setOrders] = useState('');
    const [update, setUpdate] = useState(false);
    const [redirect, setRedirect] = useState(null);
    const { agent } = useSelector((state) => state.agent);


    useEffect(() => {
        if (!agent) {
            setRedirect('/agent/login');
        }
        axios.get('/agent/getagentorders').then(({ data }) => {
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
    }, [agent, update]);


    if (redirect) {
        return <Navigate to={redirect} />;
    }

    return (
        <div >
            <AgentNav /> 
            <div className="mx-10 my-10">
                <h1 className="text-2xl font-semibold mb-8">Agent Management</h1>
            <AgentBookingDatatable rows={orders} setUpdate={setUpdate} />
            </div>
        </div>
    )
}
