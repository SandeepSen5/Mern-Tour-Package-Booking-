import { useEffect } from "react";
import "./AdminHome.scss";
import { useSelector } from 'react-redux';
import { Navigate, useNavigate } from "react-router-dom";
import { useState } from "react";


export default function AdminHome() {

    const [redirect, setRedirect] = useState(null);
    const { admin } = useSelector((state) => state.auth);

    useEffect(() => {
        if (!admin) {
            setRedirect('/admin/login');
        }
    }, [admin])


    if (redirect) {
        return <Navigate to={redirect} />;
    }

    return (
        <div className="home">
            hai
        </div>
    )
    
}