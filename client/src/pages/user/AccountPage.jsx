import { useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { Navigate } from "react-router-dom";
import UserNav from "../../components/User/UserNav";
import { logout, reset } from '../../redux/slices/user/userSlice';
import VerticalTabs from "../../components/User/ProfileUpdate";
import Footer from "../../components/User/Footer";
export default function AccountPage() {

    const [redirectlogin, setRedirectlogin] = useState(null)
    const [redirect, setRedirect] = useState(null)

    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.user)


    if (redirectlogin) {
        return <Navigate to={redirect} />;
    }

    async function logoff() {
        dispatch(logout());
        dispatch(reset());
        setRedirect("/");
    }

    if (redirect) {
        return <Navigate to={redirect} />;
    }

    return (
        <div className=" flex flex-col ">
            <UserNav />
            <div className="flex-grow mb-5">
                {user && (
                    <div className="my-4 max-w-lg mx-auto">
                        <VerticalTabs />
                    </div>
                )}
                {!user && (
                    <div className="text-center max-w-lg mx-auto mt-20 text-3xl">
                        Please Login !!!
                        <h1 className="mt-4">#Travel Around The World..</h1>
                    </div>
                )}
            </div>
            <div className="mt-10">
                <Footer />
            </div>
        </div>
    );
}
