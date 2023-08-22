import { useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { Navigate } from "react-router-dom";
import UserNav from "../../components/User/UserNav";
import { useEffect } from "react";
import { logout, reset } from '../../redux/slices/user/userSlice';

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
        <div>
            <UserNav />
            {user && (
                <div className="text-center max-w-lg mx-auto ">
                    Logged in as {user.name}({user.email})<br />
                    <button onClick={logoff} className="primary max-w-sm mt-2">Logout</button>
                </div>
            )}
            {!user &&
                <div className="text-center max-w-lg mx-auto mt-20 text-3xl ">
                    Please Login !!!
                    <h1 className="mt-4">#Travel Around The World..</h1>
                </div>

            }
        </div>
    );
}
