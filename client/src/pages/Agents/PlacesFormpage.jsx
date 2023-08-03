import { useState } from "react";
import Perks from "../../components/Perks";
import AgentNav from "../../components/AgentNav";
import axios from "axios";
import { Navigate, useParams } from "react-router-dom";
import { useEffect } from "react";
export default function PlacesFormpage() {
    const { id } = useParams()
    console.log(id);
    const [title, setTitle] = useState('');
    const [address, setAddress] = useState('');
    const [addedPhotos, setAddedPhotos] = useState([]);
    const [photosLink, setPhotosLink] = useState('');
    const [description, setDescription] = useState('');
    const [perks, setPerks] = useState([]);
    const [extraInfo, setExtraInfo] = useState('');
    const [cancelInfo, setCancelInfo,] = useState('');
    const [redirect, setRedirect] = useState(false);

    useEffect(() => {
        if (!id) {
            return;
        }
        axios.get('/agent/places/' + id).then((response) => {
            const { data } = response;
            console.log(data.title,"jjjjjjjjjjjjjjjjjjjjjjjjjjjj")
            console.log(data.photos,"ttttttttttttttttttttjjjjjjjjjjjjjjjjjjjjjjjjjjjj") 
            setTitle(data.title);
            setAddress(data.address); 
            setAddedPhotos(data.photos); 
            setDescription(data.description);
            setPerks(data.perks);
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

    async function AddnewPlace(ev) {
        ev.preventDefault();
        console.log('hai');
        console.log(title, address,
            addedPhotos, description,
            perks, extraInfo, cancelInfo)

        await axios.post('/agent/addplaces', {
            title, address,
            addedPhotos, description,
            perks, extraInfo, cancelInfo
        });
        setRedirect(true)
    }
    if (redirect) {
        return <Navigate to={"/agent/places"} />

    }

    return (
        <div>
            <AgentNav />
            <form onSubmit={AddnewPlace}>
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
                            <div className=" h-32  flex" key={link}>
                                <img className="rounded-2xl w-full object-cover" src={"http://localhost:4000/uploads/" + link}></img>
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










