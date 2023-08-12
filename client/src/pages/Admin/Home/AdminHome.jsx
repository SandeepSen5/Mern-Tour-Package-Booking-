import { useEffect } from "react";
import "./AdminHome.scss";
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";


export default function AdminHome() {
    const navigate = useNavigate();
    const { admin } = useSelector((state) => state.auth);
    useEffect(() => {
        if (!admin) {
            return navigate('/admin/login')
        }
    }, [])

    return (
        <div className="home">
            hai
        </div>
    )
}