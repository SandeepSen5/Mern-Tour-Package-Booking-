import { useState } from "react";
import { useEffect } from "react";
import axios from 'axios';
import PackageDatatables from "../../../components/Admin/PackageDatatables";

export default function AdminPackage() {

    const [packages, setPackages] = useState([]);

    useEffect(() => {

        axios.get('/admin/allpackages').then(({ data }) => {
            const formattedPackages = data.map((packagee, index) => ({
                id: index + 1,
                title: packagee.title,
                category: packagee.category,
                price: packagee.price,
                photos:packagee.photos[0],
                status: packagee.status
            }));
            setPackages(formattedPackages);
        });
    }, []);

    return (
        <div className="agents">
            <div className="info">
                <h1>Package Mangement</h1>
            </div>
            <PackageDatatables rows={packages} />
        </div>
    )
}