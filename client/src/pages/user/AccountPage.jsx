import { useContext, useState } from "react";
import { UserContext } from "../../UserContext";
import { Navigate, Link, useParams } from "react-router-dom";
import axios from "axios";
import PlacesPage from "../Agents/PlacesPage";
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
        await axios.post('/logout');
        setUser(null);
        setRedirect('/');
    }

    if (ready && !user && !redirect) {
        return <Navigate to={'/login'} />
    }

    function LinkClasses(type = null) {
        let classes = " inline-flex gap-1 py-2 px-3 rounded-full";
        if (type === updatedSubpage) {
            classes += ' bg-primary text-white ';
        }else{
            classes += ' bg-grey-200  '; 
        }
        return classes;
    }

    if (redirect) {
        return <Navigate to={redirect} />
    }

    return (
        <div>
            <nav className="w-full flex justify-center mt-8 gap-4 mb-8">
                <Link className={LinkClasses('profile')} to={'/account'} >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    My Profile</Link>
                <Link className={LinkClasses('bookings')} to={'/account/bookings'} >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                    </svg>
                    Bookings</Link>
                <Link className={LinkClasses('places')} to={'/account/places'} >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
                    </svg>
                    Accommodations</Link>
            </nav>
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
