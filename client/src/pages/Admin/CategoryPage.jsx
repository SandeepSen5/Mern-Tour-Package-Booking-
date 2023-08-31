import { useState } from 'react';
import CategoryDatatables from '../../components/Admin/CategoryDatatables';
import axios from "axios";
import { useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function CategoryPage() {

    const [category, setCategory] = useState('');
    const [redirect, setRedirect] = useState(null);
    const { admin } = useSelector((state) => state.auth)
    const [update, setUpdate] = useState(false);

    useEffect(() => {
        if (!admin) {
            setRedirect('/admin/login');
        }

        axios.get(import.meta.env.VITE_ADMIN_CP_GETALL_CATEGORY).then(({ data }) => {
            const formattedCategory = data.map((category, index) => ({
                id: index + 1,
                title: category.title,
                description: category.description[0],
                photos: category.photos[0],
                status: category.status,
            }));
            setCategory(formattedCategory);
        });
    }, [update]);
    console.log(category)


    if (redirect) {
        return <Navigate to={redirect} />;
    }

    return (
        <div>
            <div className="flex justify-end ">
                <Link className=" bg-gray-600 text-white rounded-2xl p-2 mb-2" to={'/admin/category/new'}>
                    Add New Category
                </Link>
            </div>
            <h1 className='text-xl mb-2 '> Category Management</h1>
            <CategoryDatatables rows={category} setUpdate={setUpdate} />
        </div>
    )
}