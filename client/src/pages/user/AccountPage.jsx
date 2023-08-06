import { useContext, useState } from "react";
import { UserContext } from "../../stores/UserContext";
import { Navigate, Link, useParams } from "react-router-dom";
import axios from "axios";
import PlacesPage from "../Agents/PlacesPage";
import UserNav from "../../components/User/UserNav";



export default function AccountPage() {
    const [redirect, setRedirect] = useState(null)
    const { ready, user, setUser, setReady } = useContext(UserContext);
    const { subpage } = useParams();
    let updatedSubpage = subpage; // Create a new variable to store the updated value
    if (updatedSubpage === undefined) {
        updatedSubpage = 'profile'; // Assign the default value here
    }
    console.log(updatedSubpage);

    async function logout() {
        await axios.get('/logout');
        setUser(null);
        setRedirect('/');
    }

    if (ready && !user && !redirect) {
        return <Navigate to={'/login'} />
    }



    if (redirect) {
        return <Navigate to={redirect} />
    }

    return (
        <div>
         
            <UserNav />

            {updatedSubpage === 'profile' && user && (
                <div className="text-center max-w-lg mx-auto ">
                    Logged in as {user.name}({user.email})<br />
                    <button onClick={logout} className="primary max-w-sm mt-2">Logout</button>
                </div>
            )}
            {updatedSubpage === 'places' && user && (
                <PlacesPage />
            )}
        </div>
    );
}
