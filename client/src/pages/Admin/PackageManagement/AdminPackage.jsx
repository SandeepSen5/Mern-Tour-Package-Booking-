import { useState } from "react";
import { useEffect } from "react";
import axios from 'axios';
import PackageDatatables from "../../../components/Admin/PackageDatatables";
import { useSelector } from 'react-redux';
import { Navigate } from "react-router-dom";

export default function AdminPackage() {

    const [packages, setPackages] = useState([]);
    const [redirect, setRedirect] = useState(null);
    const { admin } = useSelector((state) => state.auth)
    const [update, setUpdate] = useState(false);

    useEffect(() => {

        if (!admin) {
            setRedirect('/admin/login');
        }

        axios.get(import.meta.env.VITE_ADMIN_AP_GET_ALLPACKAGES).then(({ data }) => {
            const formattedPackages = data.map((packagee, index) => ({
                id: index + 1,
                title: packagee.title,
                category: packagee.category,
                price: packagee.price,
                photos: packagee.photos[0],
                status: packagee.status
            }));
            setPackages(formattedPackages);
        });
    }, [update]);

    if (redirect) {
        return <Navigate to={redirect} />;
    }

    return (
        <div className="agents">
            <div className="info">
                <h1>Package Mangement</h1>
            </div>
            <PackageDatatables rows={packages} setUpdate={setUpdate} />
        </div>
    )
}
