import { useEffect, useState } from "react"
import UserNav from "../../components/UserNav"
import axios from "axios"
import Test from "../../components/test";
export default function IndexPages() {
  const [places, setPlaces] = useState([]);
  useEffect(() => {
    axios.get('/places').then((response) => {
      setPlaces(response.data);
      console.log(response.data)
    })
  }, [])

  return (
    <div>
      <Test/>
      <UserNav />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 mt-20 gap-x-6 gap-y-6">
        {places.length > 0 && places.map((place) => (
          <div key={place._id}>
            <div className=" bg-gray-500 rounded-2xl flex">
              <img className=" object-cover aspect-square rounded-2xl" src={"http://localhost:4000/uploads/" + place.photos[0]} />
            </div>
            <h2 className="text-sm font-bold">{place.title}</h2>
            <h3 className="text-sm truncate">{place.address}</h3>
          <span>  ₹{ place.price}</span>/  person
          </div>
        ))}
      </div>
    </div>
  )
}







