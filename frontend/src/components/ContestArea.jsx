import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { io } from 'socket.io-client';
import { BACKEND_URL } from '../../utils';
import axios from 'axios';
import ProblemPreview from './ProblemPreview';

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
    const [remainingTime, setRemainingTime] = useState(200);
    const [lost, setLost] = useState(false);
    const [won, setWon] = useState(false);
    const [language, setLanguage] = useState('javascript');
    const contestDuration = 200;

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
            navigate(`/${userName}/home`);
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
        navigate(`/${userName}/home`);
    };

    return (
        <div className='p-2 right-0 top-0 '>
        <h4 className='fixed right-2 top-6 bg-white p-2 rounded-md shadow-md'>
                Remaining Time: {Math.floor(remainingTime / 60)}:
                {('0' + (remainingTime % 60)).slice(-2)}
            </h4>
            {question ? (
                
                <ProblemPreview title={question.title}
                    difficulty={question.difficulty}
                    tags={question.tags}
                    description={question.description}
                    inputFormat={question.inputFormat}
                    outputFormat={question.outputFormat}
                    examples={question.testCases.slice(0,2)}
                />
            ) : (
                <p>Loading question...</p>
            )}

            <div className='mt-4 bg-gray-50 p-5'>
                <label htmlFor="language">Language:</label>
                <select
                    id="language"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className='m-2 bg-yellow-200 p-2'
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
                className='p-5 '
            />

            
<button  id='submitButton' onClick={handleSubmit}
 className='flex mx-auto mb-10'>
  <svg
    height="24"
    width="24"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M0 0h24v24H0z" fill="none"></path>
    <path
      d="M5 13c0-5.088 2.903-9.436 7-11.182C16.097 3.564 19 7.912 19 13c0 .823-.076 1.626-.22 2.403l1.94 1.832a.5.5 0 0 1 .095.603l-2.495 4.575a.5.5 0 0 1-.793.114l-2.234-2.234a1 1 0 0 0-.707-.293H9.414a1 1 0 0 0-.707.293l-2.234 2.234a.5.5 0 0 1-.793-.114l-2.495-4.575a.5.5 0 0 1 .095-.603l1.94-1.832C5.077 14.626 5 13.823 5 13zm1.476 6.696l.817-.817A3 3 0 0 1 9.414 18h5.172a3 3 0 0 1 2.121.879l.817.817.982-1.8-1.1-1.04a2 2 0 0 1-.593-1.82c.124-.664.187-1.345.187-2.036 0-3.87-1.995-7.3-5-8.96C8.995 5.7 7 9.13 7 13c0 .691.063 1.372.187 2.037a2 2 0 0 1-.593 1.82l-1.1 1.039.982 1.8zM12 13a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"
      fill="currentColor"
    ></path>
  </svg>
  <span>Submit</span>
</button>

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
