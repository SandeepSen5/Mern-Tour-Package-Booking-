import { Link, useParams } from "react-router-dom"
import AgentNav from '../../components/AgentNav'
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
export default function PlacesPage() {
    const [places, setPlaces] = useState('');
    useEffect(() => {
        axios.get('/agent/places').then(({ data }) => {
            console.log(data);
            setPlaces(data);
            console.log(places, "console.log(data);");
        })
    }, [])


    return (
        <div>
            <AgentNav />
            <div className="text-center">
                <Link className="inline-flex  gap-1 justify-center bg-primary text-white py-2 px-6 rounded-full mx-auto" to={'/agent/places/new'}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Add New Place</Link>
            </div>
            <div className="mt-4">
                {places.length > 0 && places.map((place) => {
                    return (
                        <Link to={'/agent/places/' + place._id} className=" flex cursor-pointer gap-4 bg-gray-200 p-4 rounded-2xl">
                            <div className="w-24 h-32 bg-gray-300 grow shrink-0">
                                <img src={"http://localhost:4000/uploads/" + place.photos[2]} />
                            </div>
                            <div className="grow-0 shrink">
                            <h2 className="text-xl ">{place.title}</h2>
                            <p className="text-sm ">{place.address}</p>
                            
                            </div>


                        </Link>
                    )
                })}
            </div>
        </div>
    )
}







