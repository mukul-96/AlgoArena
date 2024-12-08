import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import { BACKEND_URL, extractUsername } from '../../utils';
import LeaderBoard from './LeaderBoard';

const socket = io(BACKEND_URL);

export default function Home() {
    const userName = extractUsername();
    const [friends, setFriends] = useState([]);
    const [onlineStatuses, setOnlineStatuses] = useState({});
    const [loading, setLoading] = useState(true);
    const [challengeData, setChallengeData] = useState(null);
    const [searchingForOpponent, setSearchingForOpponent] = useState(false);
    const [matchType, setMatchType] = useState('');
    const [redirecting, setRedirecting] = useState(false);
    const [roomID, setRoomID] = useState(null);
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

    return (
        // <div>
        //     <h1>Friends List</h1>
        //     <ul>
        //         {friends.map((friend) => (
        //             <li key={friend}>
        //                 {friend}
        //                 <button
        //                     onClick={() => handleChallenge(friend)}
        //                     style={{
        //                         marginLeft: '10px',
        //                         backgroundColor: onlineStatuses[friend] ? 'green' : 'gray',
        //                         color: 'white',
        //                         cursor: onlineStatuses[friend] ? 'pointer' : 'not-allowed',
        //                     }}
        //                     disabled={!onlineStatuses[friend]}
        //                 >
        //                     Challenge
        //                 </button>
        //             </li>
        //         ))}
        //     </ul>

        //     {!searchingForOpponent ? (
        //         <button onClick={randomOpponentHandler}>RANDOM</button>
        //     ) : (
        //         <div>
        //             <p>Searching for a random opponent...</p>
        //             <button onClick={cancelSearchHandler}>Cancel Search</button>
        //         </div>
        //     )}

        //     {challengeData && (
        //         <div className="challenge-notification">
        //             <p>{challengeData.from} has challenged you!</p>
        //             <button onClick={() => handleResponse('accept')}>Accept</button>
        //             <button onClick={() => handleResponse('reject')}>Reject</button>
        //         </div>
        //     )}

        
        //     <LeaderBoard/>
        // </div>
        <div className="background">
        <div className="stars"></div>
        <div className="twinkling"></div>
        <div className="container">
          {/* Header Section */}
          <header>
            <div className="profile">AlgoArena</div>
            <input type="text" className="search-bar" placeholder="Search User" />
          </header>
  
          {/* Main Content */}
          <main>
            {/* Friends List */}
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

                        {/* <button
                            
                            style={{
                                backgroundColor: onlineStatuses[friend] ? 'green' : 'gray',
                                color: 'white',
                                cursor: onlineStatuses[friend] ? 'pointer' : 'not-allowed',
                            }}
                            disabled={!onlineStatuses[friend]}
                        >
                            Challenge
                        </button> */}
                    </li>
                ))}
            </ul>
            </aside>
  
                {challengeData && (
               <div className="challenge-notification">
                     <p className='text-white'>{challengeData.from} has challenged you!</p>
                     <button onClick={() => handleResponse('accept')}>Accept</button>
                     <button onClick={() => handleResponse('reject')}>Reject</button>
                 </div>
             )}
            {/* Find Match Section */}
            {!searchingForOpponent ? (
                <div className="find-match text-white" onClick={randomOpponentHandler} >Find Match</div>

             ) : (
                 <div>
                     <p className='text-white'>Searching for a random opponent...</p>
                     <button onClick={cancelSearchHandler} className="text-white">Cancel Search</button>
                 </div>
             )}
                  {redirecting && (
                 <div className="redirecting-text">
                     <p>Redirecting to contest area in a moment...</p>
                 </div>
            )}
  
            {/* Leaderboard */}
            <LeaderBoard/>
          </main>
        </div>
      </div>
    );
}
