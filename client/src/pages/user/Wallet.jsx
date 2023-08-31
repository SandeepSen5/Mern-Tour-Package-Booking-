import { useState } from "react"
import UserNav from "../../components/User/UserNav"
import { useEffect } from "react"
import axios from "axios";

export default function Wallet() {
    const [wallet, setWallet] = useState(0);

    useEffect(() => {
        axios.get('/getwallet').then((response) => {
            setWallet(response.data);
        })
    }, [])

    return (
        <div>
            <UserNav />
            <div className="flex justify-center mt-20 mb-3">
                <h2 className="font-semibold text-2xl">   Hai {wallet.name}</h2>
            </div>
            <div className="flex justify-center ">
                <h2 className="font-semibold text-xl">My Wallet Balance is:  {wallet.wallet}/-</h2>
            </div>

        </div>
    )
}