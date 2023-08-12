import { useState } from 'react';
import CategoryDatatables from '../../components/Admin/CategoryDatatables';
import axios from "axios";
import { useEffect } from 'react';
import { Link } from 'react-router-dom';


export default function CategoryPage() {
    const [category, setCategory] = useState('')

    useEffect(() => {
        axios.get('/admin/getcategory').then(({ data }) => {
            const formattedCategory = data.map((category, index) => ({
                id: index + 1,
                title: category.title,
                description: category.description[0],
                photos: category.photos[0],
                status: category.status,
            }));
            setCategory(formattedCategory);
        });
    }, []);
    console.log(category)
    return (
        <div>
            <div className="flex justify-end ">
                <Link className=" bg-gray-600 text-white rounded-2xl p-2 mb-2" to={'/admin/category/new'}>
                    Add New Category
                </Link>
            </div>
            <h1 className='text-xl mb-2 '> Category Management</h1>
            <CategoryDatatables rows={category} />
        </div>
    )
}