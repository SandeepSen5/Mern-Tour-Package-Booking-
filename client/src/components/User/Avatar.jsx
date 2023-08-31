export default function Avatar({ username, userId, online }) {

    const colors = ['bg-red-200', 'bg-green-200', 'bg-purple-200',
        'bg-blue-200', 'bg-yellow-200', 'bg-teal-200'];

    const userIdBase10 = parseInt(userId, 16);
    const colorIndex = userIdBase10 % colors.length;
    const color = colors[colorIndex];

    console.log(username, "usernameusername");
    return (
        <div className={"w-8 h-8 relative rounded-full text-center flex items-center   " + color}>
            <div className="w-full text-center">{username && username[0]}</div>
            {online &&
                <div className="absolute w-2 h-2 bg-green-500 rounded-2xl bottom-0 right-0 border border-white"></div>
            }

        </div>
    )
}

