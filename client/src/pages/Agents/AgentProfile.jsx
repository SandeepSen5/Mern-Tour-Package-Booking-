import { useContext, useState } from "react";
import { AgentContext } from "../../AgentContext";
import { Navigate, Link, useParams } from "react-router-dom";
import axios from "axios";
import PlacesPage from "./PlacesPage";
import AgentNav from "../../components/AgentNav";

export default function AccountPage() {
    const [redirect, setRedirect] = useState(null)
    const { agent, setAgent, agentready, setAgentReady } = useContext(AgentContext);
    const { subpage } = useParams();
    
    let updatedSubpage = subpage; 
    if (updatedSubpage === undefined) {
        updatedSubpage = 'profile'; 
    }
    console.log(updatedSubpage,"sub");

    async function logout() {
        await axios.post('/agent/logout');
        setAgent(null);
        setRedirect('/agent/login');
    }

    if (agentready && !agent && !redirect) {
        return <Navigate to={'/agent/login'} />
    }

    if (redirect) {
        return <Navigate to={redirect} />
    }

    return (
        <div>  
            <AgentNav/>
            {updatedSubpage === 'profile' && agent && (
                <div className="text-center max-w-lg mx-auto ">
                    Logged in as {agent.name}<br />
                    <button onClick={logout} className="primary max-w-sm mt-2">Logout</button>
                </div>
            )}
        </div>
    );
}








