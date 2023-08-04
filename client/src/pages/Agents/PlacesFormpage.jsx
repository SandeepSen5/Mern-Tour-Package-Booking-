import { useState } from "react";
import Perks from "../../components/Perks";
import AgentNav from "../../components/AgentNav";
import axios from "axios";
import { Navigate, useParams } from "react-router-dom";
import { useEffect } from "react";
export default function PlacesFormpage() {
    const { id } = useParams()
    console.log(id, "idddddddddddddddddddddddddddddddddd");
    const [title, setTitle] = useState('');
    const [address, setAddress] = useState('');
    const [addedPhotos, setAddedPhotos] = useState([]);
    const [photosLink, setPhotosLink] = useState('');
    const [description, setDescription] = useState('');
    const [perks, setPerks] = useState([]);
    const [price, setPrice] = useState(0);
    const [extraInfo, setExtraInfo] = useState('');
    const [cancelInfo, setCancelInfo,] = useState('');
    const [redirect, setRedirect] = useState(false);

    useEffect(() => {
        if (!id) {
            return;
        }
        axios.get('/agent/places/' + id).then((response) => {
            const { data } = response;
            console.log(data.title, "jjjjjjjjjjjjjjjjjjjjjjjjjjjj")
            console.log(data.photos, "ttttttttttttttttttttjjjjjjjjjjjjjjjjjjjjjjjjjjjj")
            setTitle(data.title);
            setAddress(data.address);
            setAddedPhotos(data.photos);
            setDescription(data.description);
            setPerks(data.perks);
            setPrice(data.price);
            setExtraInfo(data.extraInfo);
            setCancelInfo(data.cancelInfo);
        })
    }, [id])

    function InputHeader(text) {
        return (
            <h2 className="text-2xl  mt-4">{text}</h2>
        );
    }

    function InputDescription(text) {
        return (
            <p className="text-gray-500 text-sm" >{text}</p>
        );
    }

    function preInput(header, description) {
        return (
            <div>
                {InputHeader(header)}
                {InputDescription(description)}
            </div>
        );
    }

    async function AddPhotoByLink(ev) {
        ev.preventDefault();
        const { data } = await axios.post('/agent/uploadbyLink', { Link: photosLink })
        console.log(data, "datadatadata")
        setAddedPhotos((prev) => {
            return [...prev, ...data];
        })
        setPhotosLink('');
    }


    console.log(addedPhotos, "addedphoto")
    function uploadPhoto(ev) {
        const files = ev.target.files;
        const data = new FormData();
        for (let i = 0; i < files.length; i++) {
            data.append('photos', files[i]);
        }
        axios.post('/agent/upload', data, {
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

    function Coverphoto(filename, ev) {
        ev.preventDefault();
        // Find the index of the photo to be set as the cover photo
        const photoIndex = addedPhotos.findIndex((photo) => photo === filename);
        if (photoIndex !== -1) {
            // Move the photo to the first position in the array
            const updatedPhotos = [
                addedPhotos[photoIndex], // The photo to be set as cover photo
                ...addedPhotos.slice(0, photoIndex), // Photos before the cover photo
                ...addedPhotos.slice(photoIndex + 1), // Photos after the cover photo
            ];
            setAddedPhotos(updatedPhotos);
        }
    }


    async function Saveplace(ev) {
        ev.preventDefault();
        const placedata = {
            title, address,
            addedPhotos, description,
            perks,price, extraInfo, cancelInfo
        }
        if (id) {
            await axios.put('/agent/updateplaces', {
                id, ...placedata
            });
            setRedirect(true)
        }
        else {
            console.log(title, address,
                addedPhotos, description,
                perks, extraInfo, cancelInfo)

            await axios.post('/agent/addplaces',
                placedata
            );
            setRedirect(true)
        }
    }

    if (redirect) {
        return <Navigate to={"/agent/places"} />
    }

    return (
        <div>
            <AgentNav />
            <form onSubmit={Saveplace}>
                {preInput('Title', 'Title for your place. should be short and catchy as in advertisement')}
                <input type='text' value={title} onChange={ev => setTitle(ev.target.value)} placeholder={"Title eg for packages"} />
                {preInput('Address', 'Address to this place')}
                <input type='text' value={address} onChange={ev => setAddress(ev.target.value)} placeholder={"Address eg for packages"} />
                {preInput('Photos', 'more = better')}
                <div className="flex  gap-2">
                    <input type="text" value={photosLink} onChange={ev => setPhotosLink(ev.target.value)} placeholder={"Add photos by link....jpg"} />
                    <button onClick={AddPhotoByLink} className="bg-gray-200 px-4 rounded-2xl">Add Photo</button>
                </div>
                <div className="gap-2 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 ">
                    {addedPhotos.length > 0 && addedPhotos.map((link) => {
                        console.log(link, "link");
                        return (
                            <div className=" h-32  flex relative" key={link}>
                                <img className="rounded-2xl w-full object-cover" src={"http://localhost:4000/uploads/" + link}></img>
                                <button onClick={(ev) => { Removephoto(link, ev) }} className="cursor-pointer absolute bottom-2 right-2 text-white bg-black bg-opacity-50 rounded-2xl p-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                    </svg>
                                </button>
                                <button onClick={(ev) => { Coverphoto(link, ev) }} className="cursor-pointer absolute bottom-2 left-2 text-white bg-black bg-opacity-50 rounded-2xl p-2">
                                    {link == addedPhotos[0] &&
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                            <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                                        </svg>
                                    }
                                    {link !== addedPhotos[0] &&
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                                        </svg>
                                    }
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
                {preInput('Decription', 'More desciption about the place')}
                <textarea value={description} onChange={ev => setDescription(ev.target.value)} />
                {preInput('Perks', ' add ons')}
                <Perks selected={perks} onChange={setPerks} />
                <div className="mt-8 mb-10">
                    {preInput('Price', 'Price for the Package Per Person')}
                    <input type="number" value={price} onChange={(ev) => { setPrice(ev.target.value) }} />
                </div>
                {preInput('ExtraInfo', 'More desciption about terms and condition')}
                <textarea value={extraInfo} onChange={ev => setExtraInfo(ev.target.value)} />
                {preInput('Cancellation Policy', 'More desciption Cancellation Policy')}
                <textarea value={cancelInfo} onChange={ev => setCancelInfo(ev.target.value)} />
                <div>
                    <button className="primary my-4">Save</button>
                </div>
            </form>
        </div>
    ) 
}


