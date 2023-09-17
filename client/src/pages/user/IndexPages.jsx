import { useEffect, useState } from "react";
import UserNav from "../../components/User/UserNav";
import axios from "axios";
import { Link } from "react-router-dom";
import Slide from "../../components/User/Slide";
import DiscreteSlider from "../../components/User/PriceSlider";
import Footer from "../../components/User/Footer";

export default function IndexPages() {
  const [places, setPlaces] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPlaces, setFilteredPlaces] = useState(places);
  const [maxPrice, setMaxPrice] = useState(65000);


  useEffect(() => {
    axios.get(import.meta.env.VITE_USER_AP_ALLPLACES).then((response) => {
      setPlaces(response.data);
    })
  }, [])

  useEffect(() => {
    const regex = new RegExp(`^${searchQuery}`, 'i');
    const filtered = places.filter(place => regex.test(place.title));
    setFilteredPlaces(filtered);
  }, [searchQuery, places]);


  useEffect(() => {
    const regex = new RegExp(`^${searchQuery}`, 'i');
    const filteredByTitle = places.filter(place => regex.test(place.title));
    const filtered = filteredByTitle.filter(place => place.price <= maxPrice);
    setFilteredPlaces(filtered);
  }, [searchQuery, maxPrice, places]);

  return (
    <div>
      <UserNav />
      <Slide />
      <div className="bg-neutral-300 -mx-3 mt-10 grid grid-cols-1 md:grid-cols-[1fr_2fr] rounded-xl">

        <div className="relative p-1 ">
          <input className="" type="text" placeholder="Search By Place" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          <div className="absolute top-5 right-5 bg-white-500 ">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
          </div>
        </div>

        <div className=" flex">
          <div className=" flex items-center text-center m-auto justify-center">
            <span className="p-2 text-2xl mb-2">Price Slider</span>
            <DiscreteSlider onPriceChange={setMaxPrice} />
          </div>
        </div>
        
      </div>


      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 mt-20 gap-x-6 gap-y-6">
        {filteredPlaces.length > 0 &&
          filteredPlaces.map(place => (
            <Link to={'/package/' + place._id} key={place._id}>
              <div className=" bg-gray-500 rounded-2xl flex">
                <img className=" object-cover aspect-square rounded-2xl" src={"https://www.letsgo.uno/uploads/" + place.photos[0]} />
              </div>
              <h2 className="text-sm font-bold">{place.title}</h2>
              <h3 className="text-sm truncate">{place.address}</h3>
              <span>  ₹{place.price}</span>/  person
            </Link>
          ))}
      </div>

      <Footer />
    </div>
  )
}







