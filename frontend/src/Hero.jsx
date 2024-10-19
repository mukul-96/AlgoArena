import { useState } from "react"
import {useNavigate } from "react-router-dom"
import { BACKEND_URL } from "../config"
export default function Hero() {
    const [userName, setUserName] = useState('')
    const navigate=useNavigate()
    const userNameHandler = (e) => {
        setUserName(e.target.value) 
    }
    const clickHandler=()=>{
        navigate(`/${userName}`)
    }

    return (
        <div>
            <h1>Hero</h1>
            <label htmlFor="username">Enter username</label>
            <input 
                type="text" 
                id="username" 
                placeholder="fireZephyr" 
                value={userName} 
                onChange={userNameHandler} 
            />
            <p>Username: {userName}</p> 
            <button onClick={clickHandler}>Submit</button>
        </div>
    )
}
