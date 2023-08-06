import "./AdminUser.scss";
import DataTable from "../../../components/Admin/DataTable";
import axios from "axios";
import { useEffect, useState } from "react";
import { useContext } from "react";
import { AdminContext } from "../../../stores/AdminContext";
import { Navigate } from "react-router-dom";
// ... import statements

export default function AdminUser() {
    
    const [users, setUsers] = useState([]);
    const { admin } = useContext(AdminContext)
   
   
    useEffect(() => {
        axios.get('/admin/users').then(({ data }) => {
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
    }, []);

    console.log(users, "formattedddddddddddd");

    return (
        <div className="users">
            <div className="info">
                <h1>Users</h1>
            </div>
            <DataTable rows={users} />
        </div>
    );
}
