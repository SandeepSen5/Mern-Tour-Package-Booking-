import { Navigate, useNavigate, useParams } from "react-router-dom";
import AgentNav from "../../components/Agent/AgentNav";
import { useDispatch, useSelector } from "react-redux";
import { logout, reset } from '../../redux/slices/agent/agentSlice'
import { useState, useEffect } from "react";
import AgentProfile from "../../components/Agent/AgentProfileUpdate"
import Footer from "../../components/User/Footer"

export default function AccountProfile() {
    const [redirect, setRedirect] = useState(null);
    const { agent } = useSelector((state) => state.agent);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { subpage } = useParams();

    useEffect(() => {
        if (!agent) {
            setRedirect('/agent/login');
        }
    }, []);

    if (redirect) {
        return <Navigate to={redirect} />;
    }

    let updatedSubpage = subpage;
    if (updatedSubpage === undefined) {
        updatedSubpage = 'profile';
    }

    async function logoff() {
        dispatch(logout());
        dispatch(reset());
    }

    return (
        <div>
            <AgentNav />
            {updatedSubpage === 'profile' && agent && (
                <div className="text-center max-w-lg mx-auto ">
                    <AgentProfile />
                </div>
            )}
            <div className="mt-48">
                <Footer />
            </div>
        </div>
    );
}
