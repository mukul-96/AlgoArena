import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { io } from 'socket.io-client';
import { BACKEND_URL } from '../../utils';
import axios from 'axios';

const socket = io(BACKEND_URL);

export default function ContestArea() {
    const languageId = {
        cpp: 52,
        javascript: 63,
        python: 71,
        java: 62,
    };

    const { userName, roomID,matchType } = useParams();
    const navigate = useNavigate();
    const [question, setQuestion] = useState(null);
    const [code, setCode] = useState('');
    const [remainingTime, setRemainingTime] = useState(40);
    const [lost, setLost] = useState(false);
    const [won, setWon] = useState(false);
    const [language, setLanguage] = useState('javascript');
    const contestDuration = 40;

    const updateHistory=async(opponentUserName,status)=>{
        try {
            const res=await axios.put(`${BACKEND_URL}/user/updatehistory`,{
                userName,
                status,
                opponentUserName,
                matchType
            })
            console.log(res.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        const fetchQuestion = async () => {
            try {
                const response = await fetch(`${BACKEND_URL}/user/random-problem`);
                const data = await response.json();
                setQuestion(data);
            } catch (error) {
                console.error('Error fetching question:', error);
                alert('Failed to load the question. Please try again.');
            }
        };
        fetchQuestion();

        const storedStartTime = localStorage.getItem('contestStartTime');
        if (storedStartTime) {
            const currentTime = Date.now();
            const elapsedSeconds = Math.floor((currentTime - storedStartTime) / 1000);
            const remaining = contestDuration - elapsedSeconds;
            setRemainingTime(remaining > 0 ? remaining : 0);
        } else {
            localStorage.setItem('contestStartTime', Date.now());
        }

        const timerId = setInterval(() => {
            setRemainingTime((prev) => Math.max(0, prev - 1));
        }, 1000);

        return () => clearInterval(timerId);
    }, [contestDuration]);

    useEffect(() => {
        if (remainingTime <= 0) {
            alert('Time is up! Redirecting to the landing page.');
            localStorage.removeItem('contestStartTime');
            navigate(`/${userName}/landing`);
        }
    }, [remainingTime, navigate, userName]);

    useEffect(() => {
        socket.emit('joinRoom', { roomID, userName });
        return () => {
            socket.emit('leaveRoom', { roomID });
        };
    }, [roomID, userName]);

    useEffect(() => {
        socket.on('contestResult', ({ winner, loser }) => {
            if (userName === winner) {
                updateHistory(loser,"win")
                setWon(true);
            } else if (userName === loser) {
                updateHistory(winner,"loose")
                setLost(true);
            }
        });

        return () => {
            socket.off('contestResult');
        };
    }, [userName]);

    const handleSubmit = () => {
        if (!question) {
            alert('No question loaded. Please try again.');
            return;
        }

        const payload = {
            source_code: code,
            problem_id: question._id,
            language_id: languageId[language],
            time: Date.now(),
            userName,
        };

        fetch(`${BACKEND_URL}/user/submit`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.status === 'Accepted') {
                    socket.emit('contestResult', { roomID, winner: userName });
                } else {
                    alert(data.message);
                }
            })
            .catch((error) => {
                console.error('Submission failed:', error);
                alert('Submission error. Please try again.');
            });
    };

    const handleCloseMessage = () => {
        setWon(false);
        setLost(false);
        localStorage.removeItem('contestStartTime');
        navigate(`/${userName}/landing`);
    };

    return (
        <div>
            <h1>Contest Area - Room: {roomID}</h1>
            {question ? (
                <>
                    <h2>Question: {question.title}</h2>
                    <p dangerouslySetInnerHTML={{ __html: question.description }} />

                    <h3>Sample Test Cases:</h3>
                    {question.testCases.slice(0, 2).map((testCase, index) => (
                        <div key={index}>
                            <p>
                                <strong>Input {index + 1}:</strong> {testCase.input}
                            </p>
                            <p>
                                <strong>Expected Output {index + 1}:</strong> {testCase.expectedOutput}
                            </p>
                        </div>
                    ))}
                    {question.testCases.length > 2 && <p><em>More test cases are hidden.</em></p>}
                </>
            ) : (
                <p>Loading question...</p>
            )}

            <div>
                <label htmlFor="language">Select Language:</label>
                <select
                    id="language"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                >
                    <option value="javascript">JavaScript</option>
                    <option value="java">Java</option>
                    <option value="cpp">C++</option>
                    <option value="python">Python</option>
                </select>
            </div>

            <Editor
                height="400px"
                language={language}
                value={code}
                onChange={(value) => setCode(value || '')}
            />

            <h4>
                Remaining Time: {Math.floor(remainingTime / 60)}:
                {('0' + (remainingTime % 60)).slice(-2)}
            </h4>
            <button onClick={handleSubmit}>Submit</button>

            {won && <WinningMessage userName={userName} onClose={handleCloseMessage} />}
            {lost && <LosingMessage userName={userName} onClose={handleCloseMessage} />}
        </div>
    );
}

const WinningMessage = ({ userName, onClose }) => (
    <div className="modal">
        <div className="modal-content">
            <h2>Congratulations, {userName}!</h2>
            <p>You have won the contest!</p>
            <button onClick={onClose}>OK</button>
        </div>
    </div>
);

const LosingMessage = ({ userName, onClose }) => (
    <div className="modal">
        <div className="modal-content">
            <h2>Sorry, {userName}!</h2>
            <p>You lost the contest!</p>
            <button onClick={onClose}>OK</button>
        </div>
    </div>
);
