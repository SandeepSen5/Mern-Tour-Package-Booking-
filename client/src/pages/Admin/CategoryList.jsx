import { useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { Link, Navigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function CategoryList() {

    const { id } = useParams();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [addedPhotos, setAddedPhotos] = useState([]);
    const [redirect, setRedirect] = useState(null);
    const { admin } = useSelector((state) => state.auth);

    const notify = (error) => toast.info(error, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
    });

    useEffect(() => {

        if (!admin) {
            setRedirect('/admin/login');
        }

        if (!id) {
            return;
        }

        axios.get(import.meta.env.VITE_ADMIN_CL_SINGLECAT_FOREDIT + `id=${encodeURIComponent(id)}`)
            .then((response) => {
                console.log(response.data);
                setTitle(response.data.title)
                setDescription(response.data.description)
                setAddedPhotos(response.data.photos)
            })
    }, [id])

    if (redirect) {
        return <Navigate to={redirect} />;
    }

    function uploadPhoto(ev) {
        console.log("enterd")
        const files = ev.target.files;
        const data = new FormData();
        for (let i = 0; i < files.length; i++) {
            data.append('photos', files[i]);
        }
        axios.post(import.meta.env.VITE_ADMIN_CL_UPLOAD_CATPHOTO, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }).then((response) => {
            const { data } = response;
            console.log(data, "uploadedddddddddddd")
            setAddedPhotos((prev) => {
                return [...prev, ...data];
            });
        });
    }

    function Removephoto(filename, ev) {
        ev.preventDefault;
        setAddedPhotos((prevPhotos) => prevPhotos.filter((photo) => photo !== filename));
    }

    async function savePlace(ev) {
        ev.preventDefault();
        const placedata = {
            title, addedPhotos, description,
        }
        if (id) {
            await axios.put(import.meta.env.VITE_ADMIN_CL_UPDATE_CATEGORY, {
                id, ...placedata
            });
            navigate('/admin/category');
        }
        else {
            try {
                await axios.post(import.meta.env.VITE_ADMIN_CL_ADDNEW_CATEGORY,
                    placedata
                );
                navigate('/admin/category');
            }
            catch (error) {
                notify(error.response.data);
            }
        }
    }

    return (
        <div>
            <div className="flex justify-end ">
                <Link className=" bg-gray-600 text-white rounded-2xl px-4   py-2 mb-2" to={'/admin/category'}>
                    Back
                </Link>
            </div>
            <form onSubmit={savePlace}>
                <h2 className="text-2xl  mt-2">Title</h2>
                <input type='text' value={title} onChange={ev => setTitle(ev.target.value)} placeholder={"Title eg for Category"} />
                <h2 className="text-2xl  mt-2">Description</h2>
                <input type='text' value={description} onChange={ev => setDescription(ev.target.value)} placeholder={"Descriptioneg for Category"} />
                <div className="gap-2 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 ">
                    {addedPhotos.length > 0 && addedPhotos.map((link) => {
                        console.log(link, "link");
                        return (
                            <div className=" h-32  flex relative" key={link}>
                                <img className="rounded-2xl w-full object-cover" src={"http://www.letsgo.uno/uploads/" + link}></img>
                                <button onClick={(ev) => { Removephoto(link, ev) }} className="cursor-pointer absolute bottom-2 right-2 text-white bg-black bg-opacity-50 rounded-2xl p-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                    </svg>
                                </button>
                            </div>
                        );
                    })}
                    <label className="cursor-pointer flex justify-center gap-1 border bg-transparent rounded-2xl p-8 text-2xl text-gray-600">
                        <input type="file" multiple className="hidden" onChange={uploadPhoto} />
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                        </svg>
                        Upload</label>
                </div>
                <div>
                    <button className=" mt-4 p-4 rounded-2xl">Save</button>
                </div>
            </form>
            <ToastContainer />
        </div>
    )
}