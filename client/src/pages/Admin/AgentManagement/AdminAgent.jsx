import axios from "axios";
import { useEffect, useState } from "react";
import AgentDatatables from "../../../components/Admin/AgentDatatable";
import { Navigate } from "react-router-dom";
import { useSelector } from 'react-redux';

export default function AdminAgent() {
    const [agents, setAgents] = useState([]);
    const [redirect, setRedirect] = useState(null);
    const { admin } = useSelector((state) => state.auth)
    const [update, setUpdate] = useState(false);

    useEffect(() => {

        if (!admin) {
            setRedirect('/admin/login');
        }

        axios.get(import.meta.env.VITE_ADMIN_AA_GETAGENTS).then(({ data }) => {
            console.log(data, "userssssssssssssssssss");
            const formattedUsers = data.map((user, index) => ({
                id: index + 1,
                name: user.name,
                email: user.email,
                number: user.number,
                status: user.status
            }));
            setAgents(formattedUsers);
        });
    }, [update]);

    if (redirect) {
        return <Navigate to={redirect} />;
    }

    console.log(agents, "formattedddddddddddd");
    return (
        <div className="agents">
            <div className="info">
                <h1>Admin Mangement</h1>
            </div>
            <AgentDatatables rows={agents} setUpdate={setUpdate} />
        </div>
    )
}


