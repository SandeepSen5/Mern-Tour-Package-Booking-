import { useState } from "react";
import { useEffect } from "react";
import { Navigate, useParams } from "react-router-dom";
import axios from "axios";

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

    useEffect(() => {
        if (!id) {
            return;
        }
        axios.get(`/place/${id}`).then((response) => {
            setPlace(response.data);
        });

    }, [id])

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
                    {place?.photos?.length > 0 && place.photos.map((photo) => (
                        <div>
                            <img className=" object-cover aspect-square rounded-2xl" src={"http://localhost:4000/uploads/" + photo} />
                        </div>
                    )
                    )}
                </div>
            </div>
        )
    }

    return (
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
                <div className="bg-white shadow p-4 rounded-2xl">
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
                </div>
            </div>
        </div>
    )
}


