import { useEffect } from "react";
import { useSelector } from 'react-redux';
import { Navigate, useNavigate } from "react-router-dom";
import { useState } from "react";
import UserCount from "../../../components/Admin/UserCount"
import PieChart from "../../../components/Admin/PieChart";
import React from 'react';
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
    {
        name: 'Page A',
        uv: 4000,

    },
    {
        name: 'Page B',
        uv: 3000,

    },
    {
        name: 'Page C',
        uv: 2000,

    },
    {
        name: 'Page D',
        uv: 2780,

    },
    {
        name: 'Page E',
        uv: 1890,

    },
    {
        name: 'Page F',
        uv: 2390,

    },
    {
        name: 'Page G',
        uv: 3490,

    },
];
export default function AdminHome() {

    const [redirect, setRedirect] = useState(null);
    const [sales, setSales] = useState(null);

    const { admin } = useSelector((state) => state.auth);

    useEffect(() => {
        axios.get('/admin/salesreport').then((response) => {
            setSales(response.data);
        })
    }, [])

    useEffect(() => {
        if (!admin) {
            setRedirect('/admin/login');
        }
    }, [admin])



    if (redirect) {
        return <Navigate to={redirect} />;
    }

    return (
        <div>
            <div>
                <UserCount />
            </div>
            <div>
                <div className="flex mt-10 gap-24">
                    <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-10">
                        <div className="">
                            <h1 className="mt-3 mb-12 font-bold text-2xl px-10">Earnings</h1>
                            <LineChart
                                width={800}
                                height={400}
                                data={sales}
                                margin={{
                                    top: 5,
                                    right: 30,
                                    left: 20,
                                    bottom: 5,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} />
                            </LineChart>
                        </div>
                        <div className="">
                            <div>
                                <h2 className="mt-3 font-semibold text-2xl text-center">Order Chart</h2>
                            </div>
                            <div>
                                <PieChart />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}





