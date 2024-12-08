import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import { BACKEND_URL, extractUsername } from '../../utils';
import LeaderBoard from './LeaderBoard';
import RandomLoader from './RandomLoader';
import axios from 'axios';

const socket = io(BACKEND_URL);

export default function Home() {
    const userName = extractUsername();
    console.log("userName",userName);
    const [friends, setFriends] = useState([]);
    const [friendUserName,setfriendUserName]=useState("");
    const [onlineStatuses, setOnlineStatuses] = useState({});
    const [loading, setLoading] = useState(true);
    const [challengeData, setChallengeData] = useState(null);
    const [searchingForOpponent, setSearchingForOpponent] = useState(false);
    const [matchType, setMatchType] = useState('');
    const [redirecting, setRedirecting] = useState(false);
    const [roomID, setRoomID] = useState(null);
    const [addFriend,setAddfriend]=useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        socket.emit('registerUser', userName);

        const fetchFriends = async () => {
            try {
                const response = await fetch(`${BACKEND_URL}/user/friends-list/${userName}`);
                if (!response.ok) throw new Error('Network response was not ok');
                const data = await response.json();
                setFriends(data.friends);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching friends:', error);
                setLoading(false);
            }
        };

        fetchFriends();

        socket.on('currentOnlineStatuses', (statuses) => {
            setOnlineStatuses((prevStatuses) => ({
                ...prevStatuses,
                ...statuses,
            }));
        });

        socket.on('friendChallenged', (data) => {
            setMatchType('challenged');
            setChallengeData(data);
        });

        socket.on('redirectToContest', ({ roomID }) => {
            setRoomID(roomID);
            setSearchingForOpponent(false);
            setRedirecting(true);
            setMatchType((prevType) => prevType); 
        });

        socket.on('opponentFound', ({ opponent }) => {
            console.log(`Random opponent found: ${opponent}`);
            setSearchingForOpponent(false);
        });

        return () => {
            socket.off('currentOnlineStatuses');
            socket.off('friendChallenged');
            socket.off('redirectToContest');
            socket.off('opponentFound');
        };
    }, [userName]);
    useEffect(()=>{
        setTimeout(()=>{
            setChallengeData(null);
        },5000)
    },[challengeData])
    useEffect(() => {
        if (roomID && matchType) {
            console.log('Navigating to:', matchType);
            setTimeout(() => {
                navigate(`/contest/${userName}/${roomID}/${matchType}`);
                setChallengeData(null);
                setRedirecting(false);
                setRoomID(null);
            }, 1000);
        }
    }, [matchType, roomID, navigate]);
    const handleChallenge = (friendUserName) => {
        setMatchType('challenged');
        socket.emit('challengeFriend', { from: userName, to: friendUserName });
    };
    const handleResponse = (response) => {
        socket.emit('respondToChallenge', {
            from: challengeData.from,
            to: challengeData.to,
            response,
        });
        setChallengeData(null);
    };

    const randomOpponentHandler = () => {
        setSearchingForOpponent(true);
        setMatchType('random');
        socket.emit('findRandomOpponent', { userName });
    };

    const cancelSearchHandler = () => {
        setSearchingForOpponent(false);
        socket.emit('cancelRandomSearch', { userName });
    };

    if (loading) {
        return <div>Loading friends...</div>;
    }
const serchFriendHandler=(e)=>
{
    setfriendUserName(e.target.value);
}
const search = async () => {
    try {
        const res = await axios.post(`${BACKEND_URL}/user/searchFriend`, {
            friendUserName: friendUserName,
        });

        if ( res.data.user) {
            setAddfriend(true); 
        } else {
            setAddfriend(false);
            alert("no user found")
        }
    } catch (error) {
        console.error("Error searching for friend:", error); 
        setAddfriend(false); 
    }
};
const addFriendHandler=async()=>
{
    try {
        const requestData = { friendUserName };
        const response = await axios.post(`${BACKEND_URL}/user/addFriend/${userName}`,requestData);
        console.log('Friend added successfully:', response.data);
    } catch (error) {
        if (error.response) {
            console.error('Failed to add friend:', error.response.data.error);
            throw new Error(error.response.data.error);
        } else if (error.request) {
            console.error('No response received:', error.request);
            throw new Error('No response from server');
        } else {
            console.error('Error:', error.message);
            throw new Error(error.message);
        }
    }
}

    return (
    
        <div className="background">
        <div className="stars"></div>
        <div className="twinkling"></div>
        <div className="container">
          <header>
            <div className="profile">AlgoArena</div>
            <button className='text-white ' onClick={search}>search</button>
            <input type="text" className="search-bar" placeholder="Search User"  onChange={serchFriendHandler} onClick={()=>{
                setAddfriend(null)
            }}/>

          </header>
            <main>
            <aside className="friends-list">
            <h1>Friends List</h1>
            <ul>
                {friends.map((friend) => (
                    <li key={friend} className="text-white font-bold" >
                    <button onClick={() => handleChallenge(friend)} className="w-full" style={{
                                cursor: onlineStatuses[friend] ? 'pointer' : 'not-allowed',
                            }}>
                     <div className="flex items-center w-full">
                     <p>{friend}</p>
                    <p className="rounded-full w-3 h-3  ml-auto" style={{
                                backgroundColor: onlineStatuses[friend] ? 'green' : 'red',
                                color: 'white',
                                cursor: onlineStatuses[friend] ? 'pointer' : 'not-allowed',
                            }}></p>
                    </div>
                    </button>
                    </li>
                ))}
            </ul>
            </aside>
            {addFriend && (
               <div className="challenge-notification mt-5">
                     <span className='mb-4 text-xl font-semibold text-cyan-100 flex justify-center '>{friendUserName}</span>
                    <div className='flex items-center justify-evenly '>
                    <button  onClick={addFriendHandler} className='text-green-500 font-semibold m-2'>ADD</button>
                    <button onClick={()=>{}} className='text-yellow-500 font-semibold m-2'>PROFILE</button>
                     <button onClick={() => setAddfriend(null)} className='text-red-500 font-semibold m-2'> CLOSE</button>

                    </div>
                 </div>
             )}
  
                {challengeData && (
               <div className="challenge-notification">
                     <p className='mb-4 text-white'><span className='text-lg font-semibold text-orange-100'>{challengeData.from}</span> dares you to accept their challenge!</p>
                    <div className='flex items-center justify-between'>
                    <button onClick={() => handleResponse('accept')} className='text-green-500 font-semibold '>ACCEPT</button>
                     <button onClick={() => handleResponse('reject')} className='text-red-500 font-semibold '> REJECT</button>

                    </div>
                 </div>
             )}
            {!searchingForOpponent ? (
                <div className="find-match text-white" onClick={randomOpponentHandler} >Find Match</div>

             ) : (
                 <div className='flex items-center flex-col'>
                     <div ><RandomLoader/></div>
                     <button onClick={cancelSearchHandler} className=" mt-4 font-semibold text-lg text-cyan-100  px-2 py-2">Cancel Search</button>
                 </div>
             )}
                  {redirecting && (
                 <div className="redirecting-text">
                     <p>Redirecting to contest area in a moment...</p>
                 </div>
            )}
              <LeaderBoard/>
          </main>
        </div>
      </div>
    );
}
