import "./AdminUser.scss";
import DataTable from "../../../components/Admin/DataTable";
import axios from "axios";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
// ... import statements

export default function AdminUser() {

    const { admin } = useSelector((state) => state.auth)
    const [users, setUsers] = useState([]);
    const [redirect, setRedirect] = useState(null);
    const [update, setUpdate] = useState(false);

    useEffect(() => {

        if (!admin) {
            setRedirect('/admin/login');
        }

        axios.get(import.meta.env.VITE_ADMIN_AU_GETUSERS).then(({ data }) => {
            console.log(data, "userssssssssssssssssss");
            const formattedUsers = data.map((user, index) => ({
                id: index + 1,
                name: user.name,
                email: user.email,
                number: user.number,
                status: user.status
            }));
            setUsers(formattedUsers);
        });
    }, [update]);

    if (redirect) {
        return <Navigate to={redirect} />;
    }

    return (
        <div className="users">
            <div className="info">
                <h1>Users</h1>
            </div>
            <DataTable rows={users} setUpdate={setUpdate} />
        </div>
    );
}
