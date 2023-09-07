import { useState } from "react";
import UserNav from "../../components/User/UserNav";
import { useEffect } from "react";
import axios from "axios";
import Footer from "../../components/User/Footer";
export default function Wallet() {
    const [wallet, setWallet] = useState(0);

    useEffect(() => {
        axios.get('/getwallet').then((response) => {
            setWallet(response.data);
        })
    }, [])

    return (
        <div className="flex flex-col min-screen ">
          <UserNav />
          <div className="flex justify-center mt-20 mb-3">
            <h2 className="font-semibold text-2xl">Hai {wallet.name}</h2>
          </div>
          <div className="flex justify-center mt-2">
            <h2 className="font-semibold text-xl">Your Wallet Balance is: {wallet.wallet}/-</h2>
          </div>
          <div className="flex justify-center mt-2">
            <h2 className="font-semibold text-xl">Enjoy Shopping</h2>
          </div>
          <div className="flex-grow mt-32 mb-40 "></div> {/* This creates a flexible space to push the footer to the bottom */}
          <Footer className="sticky bottom-0" />
        </div>
      );
}


