import { Link, Navigate, useParams } from "react-router-dom";
import AgentNav from '../../components/Agent/AgentNav';
import { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import Footer from "../../components/User/Footer";

export default function PlacesPage() {

    const [places, setPlaces] = useState('');
    const [redirect, setRedirect] = useState(null);
    const { agent } = useSelector((state) => state.agent);

    useEffect(() => {

        if (!agent) {
            setRedirect('/agent/login');
        }

        axios.get(import.meta.env.VITE_AGENT_PP_AGENT_GET_ADDEDPLACES).then(({ data }) => {
            console.log(data);
            setPlaces(data);
            console.log(places, "console.log(data);");
        })
    }, [])


    if (!agent) {
        return <Navigate to='/agent/login' />;
    }

    if (redirect) {
        return <Navigate to={redirect} />;
    }

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
                {places.length > 0 && places.map((place) => (
                    <div key={place._id}>
                        {place.owner === agent._id ? (
                            <Link to={`/agent/places/${place._id}`} className="flex cursor-pointer gap-4 bg-gray-200 p-4 rounded-2xl mb-3">
                                <div className="bg-gray-300 grow shrink-0 object-cover">
                                    <img className="w-32 h-32 object-cover rounded-lg" src={`https://www.letsgo.uno/uploads/${place.photos[0]}`} alt={`Place ${place.title}`} />
                                </div>
                                <div className="grow-0 shrink">
                                    <h2 className="text-xl">{place.title}</h2>
                                    <p className="text-sm">{place.address}</p>
                                </div>
                            </Link>
                        ) : (
                            <div className="flex cursor-pointer gap-4 bg-gray-200 p-4 rounded-2xl mb-3">
                                <div className="bg-gray-300 grow shrink-0 object-cover">
                                    <img className="w-32 h-32 object-cover rounded-lg" src={`http://www.letsgo.uno/uploads/${place.photos[0]}`} alt={`Place ${place.title}`} />
                                </div>
                                <div className="grow-0 shrink">
                                    <h2 className="text-xl">{place.title}</h2>
                                    <p className="text-sm">{place.address}</p>
                                </div>
                            </div>
                        )}
                    </div>
                ))}

            </div>
            <Footer />
        </div >
    )
}







