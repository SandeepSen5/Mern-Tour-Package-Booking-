import { useEffect, useState } from "react";
import UserNav from "../../components/User/UserNav";
import Banner from "../../components/User/Banner";
import axios from "axios";
import { Link } from "react-router-dom";
import Footer from "../../components/User/Footer";
import { useParams } from "react-router-dom";

export default function UserCategoryPage() {

  const { id } = useParams();
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    axios.get(import.meta.env.VITE_USER_UCP_CATEGORY_SELECTED + id).then((response) => {
      setPlaces(response.data);
    })
  }, [])


  return (
    <div>
      <UserNav />
      <Banner />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 mt-20 gap-x-6 gap-y-6">
        {places.length > 0 && places.map((place) => (
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







