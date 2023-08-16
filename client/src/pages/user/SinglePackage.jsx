import { useState } from "react";
import { useEffect } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { useSelector } from 'react-redux';
import UserNav from "../../components/User/UserNav"
import axios from "axios";
import Swal from 'sweetalert2'

export default function SinglePackage() {

    const { id } = useParams();
    const [place, setPlace] = useState('')
    const [showall, setShowall] = useState(false);
    const [bookin, setBookin] = useState('');
    const [guestno, setGuestno] = useState(1);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [redirect, setRedirect] = useState(false);
    const [reviews, setReviews] = useState('')
    const [update, setUpdate] = useState(false);
    const { user } = useSelector((state) => state.user);
    console.log(user, "usersssssssssss")

    useEffect(() => {
        if (!id) {
            return;
        }
        axios.get(`/allreviews/${id}`).then((response) => {
            setReviews(response.data);
        })
        axios.get(`/place/${id}`).then((response) => {
            setPlace(response.data);
        });

    }, [id, update])

    if (!place) {
        return '';
    }

    async function bookThis() {

        const data = {
            bookin, guestno, name, email, phone,
            place: place._id, price: place.price
        }
        await axios.post('/bookings', data).then((response) => {
            setRedirect(`/payment/${response.data._id}`);
        });
    }

    if (redirect) {
        return <Navigate to={redirect} />;
    }

    if (showall) {
        return (
            <div className="absolute inset-0 bg-white  min-h-screen">
                <div className="p-8 grid gap-4">
                    <div>
                        <h2 className="text-3xl mr-36">Photos of {place.title}</h2>
                        <button onClick={() => { setShowall(false) }} className=" fixed right-8 top-8 flex gap-2 py-2 px-2 rounded-2xl shadow shadow-black"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                            close Photos </button>
                    </div>
                    {place?.photos?.length > 0 && place.photos.map((photo, index) => (
                        <div key={index}>
                            <img className=" object-cover aspect-square rounded-2xl" src={"http://localhost:4000/uploads/" + photo} />
                        </div>
                    )
                    )}
                </div>
            </div>
        )
    }

    async function handleDeleteReview(catid) {
        console.log(catid, "categoryiddddddddd");
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`/deletecatid/${catid}`, { catid }).then((response) => {
                    Swal.fire(
                        'Deleted!',
                        'Your Review has been deleted.',
                        'success'
                    )
                    setUpdate((prev) => !prev);
                })
            }
        })
    }

    return (
        <div>
            <UserNav />
            <div className="mt-8 bg-gray-100 -mx-8 px-8 py-6">
                <h1 className="text-3xl">{place.title}</h1>
                <a className="flex gap-2 my-2 text-sm block font-semibold underline" target="_blank" href={`https://maps.google.com/?q=${place.title}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                    {place.title}</a>
                <div className="relative">
                    <div className="grid gap-2 grid-cols-[2fr_1fr]">
                        <div>
                            <img className="aspect-square object-cover" src={"http://localhost:4000/uploads/" + place.photos[0]} />
                        </div>
                        <div className="grid gap">
                            <img className="aspect-square object-cover" src={"http://localhost:4000/uploads/" + place.photos[2]} />
                            <div className="border border-red-500  overflow-hidden">
                                <img className="aspect-square object-cover relative top-2" src={"http://localhost:4000/uploads/" + place.photos[3]} />
                            </div>
                        </div>
                    </div>
                    <button onClick={() => { setShowall(true) }} className="flex gap-1 absolute bottom-2 right-2 px-2 py-2 bg-whte rounded-2xl shadow shadow-md shadow-gray-500 ">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                        </svg>
                        Show more
                    </button>
                </div>
                <div className="my-4">
                    <h2 className="font-semibold text-2xl">About</h2>
                    {place.address}
                </div>
                <div className="my-4">
                    <h2 className="font-semibold text-2xl">Day Iternary</h2>
                    {place.description}
                </div>
                <div className="mt-10 grid grid-cols-1 md:grid-cols-[2fr_1fr]">
                    <div>
                    </div>
                    {user && <div className="bg-white shadow p-4 rounded-2xl">
                        <div className="text-2xl text-center">
                            Price :  ₹{place.price} / person
                        </div>
                        <div className="flex grid grid-cols-2">
                            <div className="my-4 border px-2 py-2 ">
                                <label> Book  in    :</label>
                                <input type="date" value={bookin} onChange={(ev) => { setBookin(ev.target.value) }} />
                            </div>
                            <div className="my-4 border px-2 py-2 ">
                                <label> Max Persons   :</label>
                                <input type="Number" value={guestno} onChange={(ev) => { setGuestno(ev.target.value) }} />
                            </div>
                        </div>
                        {bookin && (
                            <div className="">
                                <div className="my-4 border px-2 py-2 ">
                                    <label>Name  :</label>
                                    <input type="text" placeholder="Enter Name" value={name}
                                        onChange={(ev) => setName(ev.target.value)} />
                                </div>
                                <div className="my-4 border px-2 py-2 ">
                                    <label>Phone :</label>
                                    <input type="text" placeholder="Mobile Number"
                                        value={phone}
                                        onChange={(ev) => setPhone(ev.target.value)} />
                                </div>
                                <div className="my-4 border px-2 py-2 ">
                                    <label>Email  :</label>
                                    <input type="email" placeholder="Email"
                                        value={email}
                                        onChange={(ev) => setEmail(ev.target.value)} />
                                </div>
                            </div>
                        )}
                        <button onClick={bookThis} className="primary">Book</button>
                    </div>}
                </div>
                <div className="mt-4 p-4 rounded-2xl">
                    <h1 className="text-2xl mb-4 underline">Reviews</h1>
                    {reviews.length > 0 && reviews.map((review) => {
                        return (
                            <div className=" flex cursor-pointer gap-4  mb-6 relative">
                                <div className="grow-0 shrink ">
                                    <div className="flex gap-2 mb-3 items-center ">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <h2 className="text-xl  ">
                                            {review.owner.name}</h2>
                                    </div>
                                    <p className="text-sm  mx-9">{review.desc}</p>
                                    {user && user._id == review.owner._id &&
                                        <div className="absolute right-0 bottom-0 ">
                                            <button className="cursor-pointer absolute bottom-2 right-2 text-white bg-red-500 p-2 rounded-2xl p-2" onClick={() => handleDeleteReview(review._id)} >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6" >
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                </svg>
                                            </button>
                                        </div>
                                    }
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>

    )
}


