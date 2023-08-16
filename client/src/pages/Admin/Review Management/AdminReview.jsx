import { useState } from "react";
import { useEffect } from "react";
import axios from 'axios';
import ReviewDatatable from "../../../components/Admin/ReviewDatatable";
import { useSelector } from 'react-redux';
import { Navigate } from "react-router-dom";

export default function AdminReview() {

    const [reviews, setReviews] = useState([]);
    const [redirect, setRedirect] = useState(null);
    const { admin } = useSelector((state) => state.auth)
    const [update, setUpdate] = useState(false);

    useEffect(() => {

        if (!admin) {
            setRedirect('/admin/login');
        }

        axios.get('/admin/allreviews').then(({ data }) => {

            const formattedReviews = data.map((review, index) => ({
                id: index + 1,
                keyid:review._id,
                name: review.owner.name,
                Package: review.place.title,
                comment: review.desc,
                status: review.status
            }));
            setReviews(formattedReviews);
        });
    }, [update]);

    if (redirect) {
        return <Navigate to={redirect} />;
    }

    return (
        <div className="agents">
            <div className="info">
                <h1>Review Mangement</h1>
            </div>
            <ReviewDatatable rows={reviews} setUpdate={setUpdate} />
        </div>
    )
}
