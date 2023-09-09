import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import UserNav from "../../components/User/UserNav";
import Avatar from "../../components/User/Avatar";
import { useSelector } from "react-redux";
import { uniqBy } from 'lodash';
import { useRef } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";
import Footer from "../../components/User/Footer";

export default function Userchat() {

    const [ws, setWs] = useState(null);
    const [onlinePeople, setOnlinePeople] = useState({});
    const [agents, setAgents] = useState({})
    const [selectedUserid, setSelectedUserid] = useState(null);
    const { user } = useSelector((state) => state.user);
    const [newmessage, setNewmessage] = useState('');
    const [messages, setMessage] = useState([]);
    const messageBoxRef = useRef();
    const { pathname } = useLocation();
    const id = pathname.substring(pathname.lastIndexOf("/") + 1);
    console.log(id, "ididid")
    console.log(selectedUserid, "[selectedUserid[selectedUserid")

    useEffect(() => {
        if (id && id != "contact") {
            setSelectedUserid(id);
        }
    }, []);


    if (!user) {
        console.log(user, "2");
        return <Navigate to={'/login'} />;
    }


    useEffect(() => {
        connectionToWs();
    }, []);


    function connectionToWs() {
        // const ws = new WebSocket('ws://localhost:4000')
        const ws = new WebSocket('wss://www.letsgo.uno');

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
        if ('online' in messageData) {
            showOnlinePeople(messageData.online);
        } else if ('text' in messageData) {
            setMessage(prev => ([...prev, { ...messageData }]))
        }
    }


    function showOnlinePeople(peopleArray) {
        const people = {};
        peopleArray.forEach(({ userId, username }) => {
            people[userId] = username;
        })
        setOnlinePeople(people);
    }


    function sendMessage(ev, file = null) {
        if (ev) {
            ev.preventDefault();
        }
        Notification.requestPermission().then(perm => {
            if (perm == "granted") {
                new Notification("Example Notification", {
                    body: "This is more text",
                });
            }
        })
        ws.send(JSON.stringify({
            sender: user._id,
            recipient: selectedUserid,
            text: newmessage,
            file,
        }));
        setNewmessage('');
        setMessage(prev => ([...prev, { text: newmessage, sender: user._id, recipient: selectedUserid, _id: Date.now() }]));
        if (file) {
            setTimeout(() => {
                axios.get('/getmessages/' + selectedUserid).then((response) => {
                    const { data } = response;
                    setMessage(data);
                });
            }, 2000);
        }
    }


    function sendFile(ev) {
        const reader = new FileReader();
        reader.readAsDataURL(ev.target.files[0]);
        reader.onload = () => {
            sendMessage(null, {
                name: ev.target.files[0].name,
                data: reader.result,
            })
        }
    }


    useEffect(() => {
        const div = messageBoxRef.current;
        if (div) {
            div.scrollIntoView({ behaviour: "smooth" });
        }
    }, [messages])


    useEffect(() => {
        axios.get(import.meta.env.VITE_USER_UC_AGENTS_FORCHAT).then((response) => {
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
    console.log(onlinePeopleExclOurUser, "onlinePeopleExclOurUser");
    const messagesWithoutDupes = uniqBy(messages, '_id');
    console.log(messagesWithoutDupes, "messagesWithoutDupesmessagesWithoutDupesmessagesWithoutDupes")
    const filteredOnlinePeople = Object.keys(onlinePeopleExclOurUser).reduce((acc, key) => {
        if (onlinePeopleExclOurUser[key] !== undefined) {
            acc[key] = onlinePeopleExclOurUser[key];
        }
        return acc;
    }, {});

    console.log(filteredOnlinePeople, "filteredOnlinePeople");




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

                        <div className="items-center text-2xl flex justify-center gap-2 mb-6 mt-1 ">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                            </svg>
                            Message Agents</div>
                        {Object.keys(agents).map(userId => (
                            <div key={userId} onClick={() => setSelectedUserid(userId)} className={"border-b border-gray-200 flex items-center gap-1 mb-5 cursor-pointer p-2 " + (userId == selectedUserid ? 'bg-gray-400' : 'bg-gray-50')}>
                                <Avatar online={false} username={agents[userId]} userId={userId} />
                                <span>{agents[userId]}</span>
                            </div>
                        ))}

                        {filteredOnlinePeople &&
                            <div className="h-1/2 overflow-y-scroll">
                                <div className="items-center text-2xl flex justify-center gap-2 mb-6 mt-1 ">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                                    </svg>
                                    Live Connect The World</div>
                                {Object.keys(filteredOnlinePeople).map(userId => (
                                    <div key={userId} onClick={() => setSelectedUserid(userId)} className={"border-b border-gray-200 flex items-center gap-1 mb-5 cursor-pointer p-2 " + (userId == selectedUserid ? 'bg-gray-400' : 'bg-gray-50')}>
                                        <Avatar online={true} username={onlinePeople[userId]} userId={userId} />
                                        <span>{onlinePeople[userId]}</span>
                                    </div>
                                ))}
                            </div>
                        }
                    </div>

                    <div className=" flex flex-col bg-gray-400 w-2/3 p-2">
                        {!selectedUserid && <div className="flex-grow">
                            <div className="flex justify-center items-center h-full ">
                                <div className="text-2xl">&larr; No Chat Selected</div>
                            </div>
                        </div>
                        }

                        {selectedUserid && onlinePeople[selectedUserid] &&
                            (
                                <div className="bg-gray-300 rounded-xl">
                                    <div className="flex items-center text-center  gap-2 p-2 mr-10 my-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <h2 className="text-xl">{onlinePeople[selectedUserid]}</h2>
                                    </div>
                                </div>
                            )
                        }

                        {selectedUserid && agents[selectedUserid] &&
                            (
                                <div className="bg-gray-300 rounded-xl">
                                    <div className="flex items-center text-center  gap-2 p-2 mr-10 my-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>

                                        <h2 className="text-2xl">{agents[selectedUserid]}</h2>
                                    </div>
                                </div>
                            )
                        }


                        {selectedUserid && (
                            <div className="flex-grow overflow-y-scroll p-2 my-2 rounded-2x text-sm">
                                {messagesWithoutDupes.map(message => {
                                    // Check if message.createdAt is a valid date
                                    const createdAt = new Date(message.createdAt);
                                    const isValidDate = !isNaN(createdAt.getTime());

                                    // Check if the message contains an audio file
                                    const isAudioMessage = message.file && message.file.endsWith(".mp3");
                                    const isVideoMessage = message.file && message.file.endsWith(".mp4");
                                    const isImageMessage = message.file && (message.file.endsWith(".jpg") || message.file.endsWith(".png") || message.file.endsWith(".gif"));


                                    return (
                                        <div key={message._id} className={(message.sender === user._id ? 'text-right' : 'text-left')}>
                                            <div className={"text-left rounded-2xl inline-block p-2 mb-2 " + (message.sender === user._id ? 'bg-gray-200' : 'bg-gray-200')}>
                                                {message.text}
                                                {isImageMessage && (
                                                    <div className="">
                                                        <img
                                                            src={"https://www.letsgo.uno/uploads/" + message.file}
                                                            alt="Image"
                                                            style={{ maxWidth: '200px', maxHeight: '200px' }} // Adjust the values as needed
                                                        />
                                                    </div>
                                                )}

                                                {isAudioMessage && (
                                                    <div className="">
                                                        <audio controls>
                                                            <source src={"https://www.letsgo.uno/uploads/" + message.file} type="audio/mpeg" />
                                                            Your browser does not support the audio element.
                                                        </audio>
                                                    </div>
                                                )}
                                                {isVideoMessage && (
                                                    <div className="">
                                                        <video controls>
                                                            <source src={"https://www.letsgo.uno/uploads/" + message.file} type="video/mp4" />
                                                            Your browser does not support the video element.
                                                        </video>
                                                    </div>
                                                )}
                                                <div className="flex justify-between mb-1">
                                                    <span className="text-gray-500 text-xs">
                                                        {isValidDate ? createdAt.toLocaleString() : new Date().toLocaleString()}
                                                        {/* Display the timestamp or current date/time */}
                                                    </span>
                                                    {/* You can add other message metadata here */}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                                <div ref={messageBoxRef}></div>
                            </div>
                        )}


                        {selectedUserid &&
                            (
                                <form className="flex gap-2" onSubmit={sendMessage}>
                                    <input type="text" value={newmessage} onChange={(e) => setNewmessage(e.target.value)} placeholder="Type your message" className="bg-white border p-2" />
                                    <label type="button" className="bg-blue-300 p-2 rounded-2xl cursor-pointer">
                                        <input type="file" className="hidden tex-center" onChange={sendFile} />
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 my-4">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" />
                                        </svg>
                                    </label>
                                    <button type='submit' className="bg-blue-300 p-2 rounded-2xl">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                                        </svg>
                                    </button>
                                </form>
                            )
                        }
                    </div>
                </div>
            }
            <div>
            </div>
            <Footer />
        </div>
    )
}



