
import { auth, provider } from "./config";
import { signInWithPopup } from "firebase/auth";
import { useState } from "react";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { login } from "../../../redux/slices/user/googleSlice";
import axios from "axios";

export default function GoogleLogin() {

    const [value, setValue] = useState('');
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [redirect, setRedirect] = useState('');
    const { user } = useSelector((state) => state.user);
    const dispatch = useDispatch();

    const handleClick = () => {

        signInWithPopup(auth, provider).then((data) => {
            setEmail(data.user.email);
            setName(data.user.displayName);
            const email = data.user.email;
            const name = data.user.displayName;
            const userdata = { email, name };
            dispatch(login(userdata));
        })
    }

    useEffect(() => {
        if (user) {
            setRedirect('/')
        }
    }, [user])


    if (redirect) {
        return <Navigate to={redirect} />
    }

    return (
        <div>
            <button onClick={handleClick}>Signin With Google</button>
        </div>
    )
}



