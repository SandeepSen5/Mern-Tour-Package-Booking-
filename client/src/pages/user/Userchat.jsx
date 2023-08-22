import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserNav from "../../components/User/UserNav";
import Avatar from "../../components/User/Avatar";
import { useSelector } from "react-redux";
import { uniqBy } from 'lodash';
import { useRef } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";

export default function Userchat() {

    const [ws, setWs] = useState(null);
    const [onlinePeople, setOnlinePeople] = useState({});
    const [agents, setAgents] = useState({})
    const [selectedUserid, setSelectedUserid] = useState(null);
    const { user } = useSelector((state) => state.user);
    const [newmessage, setNewmessage] = useState('');
    const [messages, setMessage] = useState([]);
    const messageBoxRef = useRef();
    
    if (!user) {
        console.log(user, "2");
        return <Navigate to={'/login'} />;
    }

    useEffect(() => {
        connectionToWs();
    }, []);

    function connectionToWs() {
        const ws = new WebSocket('ws://localhost:4000')
        setWs(ws);
        ws.addEventListener('message', handleMessage);
        ws.addEventListener('close', () => {
            setTimeout(() => {
                console.log('Disconnected. Trying to connect');
                connectionToWs();
            }, 1000);
        });
    }


    function handleMessage(ev) {
        const messageData = JSON.parse(ev.data);
        console.log(messageData, "hai")
        if ('online' in messageData) {
            showOnlinePeople(messageData.online);
        } else if ('text' in messageData) {
            console.log({ messageData }, "loaddddddddddddddddddddddddd");
            setMessage(prev => ([...prev, { ...messageData }]))
        }
    }


    function showOnlinePeople(peopleArray) {
        const people = {};
        peopleArray.forEach(({ userId, username }) => {
            people[userId] = username;
        })
        setOnlinePeople(people)
    }


    function sendMessage(ev) {
        ev.preventDefault();
        ws.send(JSON.stringify({
            sender: user._id,
            recipient: selectedUserid,
            text: newmessage
        }));
        setNewmessage('');
        setMessage(prev => ([...prev, { text: newmessage, sender: user._id, recipient: selectedUserid, _id: Date.now() }]));
    }


    useEffect(() => {
        const div = messageBoxRef.current;
        if (div) {
            div.scrollIntoView({ behaviour: "smooth" });
        }
    }, [messages])


    useEffect(() => {
        axios.get('/getall').then((response) => {
            const agents = {};
            const allAgentsarray = response.data;
            allAgentsarray.forEach(({ userId, username }) => {
                agents[userId] = username;
            })
            setAgents(agents);
        })
    }, [])


    useEffect(() => {
        if (selectedUserid) {
            axios.get('/getmessages/' + selectedUserid).then((response) => {
                const { data } = response;
                setMessage(data);
            })
        }
    }, [selectedUserid])


    const onlinePeopleExclOurUser = { ...onlinePeople };
    delete onlinePeopleExclOurUser[user._id];

    const messagesWithoutDupes = uniqBy(messages, '_id');

    return (
        <div>
            <UserNav />

            {!user &&
                <div className="text-center max-w-lg mx-auto mt-20 text-3xl ">
                    Please Login !!!
                    <h1 className="mt-4">#Travel Around The World..</h1>
                </div>
            }

            {user &&
                <div className="flex h-screen ">
                    <div className="bg-gray-50 w-1/3 ">

                        {!!onlinePeopleExclOurUser &&
                            <div className="h-1/2 overflow-y-scroll">
                                <div className="items-center text-2xl flex justify-center gap-2 mb-6 mt-1 ">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                                    </svg>
                                    Live Connect The World</div>
                                {Object.keys(onlinePeopleExclOurUser).map(userId => (
                                    <div key={userId} onClick={() => setSelectedUserid(userId)} className={"border-b border-gray-200 flex items-center gap-1 mb-5 cursor-pointer " + (userId == selectedUserid ? 'bg-blue-50' : 'bg-gray-50')}>
                                        <Avatar online={true} username={onlinePeople[userId]} userId={userId} />
                                        <span>{onlinePeople[userId]}</span>
                                    </div>
                                ))}
                            </div>
                        }

                        <div className="items-center text-2xl flex justify-center gap-2 mb-6 mt-1 ">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                            </svg>
                            Message Agents</div>
                        {Object.keys(agents).map(userId => (
                            <div key={userId} onClick={() => setSelectedUserid(userId)} className={"border-b border-gray-200 flex items-center gap-1 mb-5 cursor-pointer " + (userId == selectedUserid ? 'bg-blue-50' : 'bg-gray-50')}>
                                <Avatar online={false} username={agents[userId]} userId={userId} />
                                <span>{agents[userId]}</span>
                            </div>
                        ))}

                    </div>

                    <div className=" flex flex-col bg-blue-50 w-2/3 p-2">

                        {!selectedUserid && <div className="flex-grow">
                            <div className="flex justify-center items-center h-full ">
                                <div className="text-2xl">&larr; No Chat Selected</div>
                            </div>
                        </div>
                        }

                        {!!selectedUserid && (
                            <div className="flex-grow overflow-y-scroll  p-2 my-2 rounded-2x text-sm">
                                {messagesWithoutDupes.map(message => (
                                    <div key={message._id} className={(message.sender == user._id ? 'text-right' : 'text-left')}>
                                        <div className={"text-left rounded-2xl inline-block p-2 mb-2  " + (message.sender == user._id ? 'bg-gray-200' : 'bg-gray-200')}>
                                            {/* {message.sender == user._id ? 'Me' : ''} */}
                                            {message.text}
                                        </div>
                                    </div>
                                ))}
                                <div ref={messageBoxRef}></div>
                            </div>
                        )
                        }

                        {!!selectedUserid &&
                            <form className="flex gap-2" onSubmit={sendMessage}>
                                <input type="text" value={newmessage} onChange={(e) => setNewmessage(e.target.value)} placeholder="Type your message" className="bg-white border p-2" />
                                <button type='submit' className="bg-blue-300 p-2 rounded-2xl">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                                    </svg>
                                </button>
                            </form>
                        }

                    </div>
                </div>
            }
        </div>
    )
}



