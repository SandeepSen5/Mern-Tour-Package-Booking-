import { NavLink } from "react-router-dom"
import Footer from "../../components/User/Footer"
export default function AgentError() {
    return (
        <div className="flex mx-auto my-52">
            <div className="text-center  ">
                <h1 className="text-2xl mb-2">404!!..Page Not Found</h1>
                <h3 className="text-xl mb-4">The link you clicked may be broken or the page may have been removed.
                </h3>
                <NavLink to={'/agent'} className="bg-green-400 p-3 rounded-2xl" >Back to Home Page</NavLink>
            </div>
            
        </div>
        
    )
}