
import DataTable from "../../../components/Admin/DataTable";
import axios from "axios";
import { useEffect, useState } from "react";
import AgentDatatables from "../../../components/Admin/AgentDatatable";
import { useContext } from "react";
import { AdminContext } from "../../../stores/AdminContext";
import { Navigate } from "react-router-dom";

export default function AdminAgent() {
    const [agents, setAgents] = useState([]);
    const { admin } = useContext(AdminContext)
    
    useEffect(() => {
        axios.get('/admin/agents').then(({ data }) => {
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
    }, []);

    console.log(agents, "formattedddddddddddd");
    return (
        <div className="agents">
            <div className="info">
                <h1>Admin Mangement</h1>
            </div>
            <AgentDatatables rows={agents} />
        </div>
    )
}


