import { Outlet } from "react-router-dom";
import AgentHeader from "./AgentHeader"

export default function () {
    return (
        <div className="p-4 flex flex-col min-h-screen">
           <AgentHeader/>
            <Outlet />
        </div>
    )
}


 