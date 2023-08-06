import "./AdminHome.scss";
import { useContext } from "react";
import { AdminContext } from "../../../stores/AdminContext";
import { Navigate } from "react-router-dom";

export default function AdminHome() {
    const { admin } = useContext(AdminContext)
    if (!admin) {
        return <Navigate to={'/admin/login'} />
    }
    return (
        <div className="home">
          
        </div>
    )
}