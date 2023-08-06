import { useEffect } from "react";
import { createContext, useState } from "react";
import axios from "axios";
export const AgentContext = createContext({});
export function AgentContextProvider({ children }) {
    const [agent, setAgent] = useState(null);
    const [agentready, setAgentReady] = useState(false);

    useEffect(() => {
        if (!agent) {
            axios.get('/agent/profile').then(({ data }) => {
                console.log(data,"agentinfo")
                setAgent(data);
                setAgentReady(true);
            })
        }
    }, [])
    return (
        <AgentContext.Provider value={{ agent, setAgent, agentready, setAgentReady }} >
            {children}
        </AgentContext.Provider>
    )
}




