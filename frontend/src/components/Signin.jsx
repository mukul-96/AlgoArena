import { useState,useEffect } from "react";
import { BACKEND_URL } from "../../utils";
import {  useNavigate } from "react-router-dom";
import axios from "axios";



export default function Signin() {
    const [email, setEmail] = useState("");
    const [userName, setuserName] = useState("");
    const [RegisteruserName, setRegisteruserName] = useState("");
    const [password, setPassword] = useState("");
    const [signup,setSignup]=useState(false);
    const navigate = useNavigate();

    const emailChangeHandler = (e) => {
      setEmail(e.target.value);
    };
    const userNameChangeHandler = (e) => {
        setRegisteruserName(e.target.value);
    };

    const passwordChangeHandler = (e) => {
      setPassword(e.target.value);
    };
    const submitSignUpHandler=async()=>{
        try {
            const username=RegisteruserName;
            const res = await axios.post(`${BACKEND_URL}/user/register`, {
                email,
                password,
                username
            });
            console.log("register Successful:", res.data);

            const user = res.data.user.username;
            console.log(user);

            setuserName(user);
            if (res.data.token) {
                localStorage.setItem("authorization", `bearer ${res.data.token}`);
            }
        } catch (error) {
            console.error("register Failed:", error);
        }
    };

    useEffect(() => {
        if (userName) {
          navigate(`/${userName}/landing`);
        }
    }, [userName, navigate]);

    const submitSigninHandler = async () => {
        try {
            const res = await axios.post(`${BACKEND_URL}/user/login`, {
                email,
                password,
            });
            console.log("Login Successful:", res.data);

            const user = res.data.user.username;
            console.log(user);

            setuserName(user);
            if (res.data.token) {
                localStorage.setItem("authorization", `bearer ${res.data.token}`);
            }
        } catch (error) {
            console.error("Login Failed:", error);
        }
    };

    return (
      <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center overflow-hidden">
        <div className="max-w-screen-xl m-0 sm:m-4 bg-white shadow sm:rounded-lg flex justify-center flex-1">
          <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-0">
            <div className="">
              <img
                src="/logo.png"
                alt="Logo"
                className="w-64 h-64 mx-auto "
              />
            </div>
            <div className=" flex flex-col items-center">
    {!signup &&<h1 className="text-2xl xl:text-3xl font-extrabold">Sign In</h1>} 
    {signup &&<h1 className="text-2xl xl:text-3xl font-extrabold">Sign Up</h1>} 
             <div className="w-full flex-1 mt-6">
               
                <div className="my-8 border-b text-center">
                 { !signup && <div className="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2">
                    Don&apos;t have an account,<span className="text-blue-400 cursor-pointer" onClick={()=>{ setSignup(!signup);}}> Register Now</span>
                  </div>}
                 { signup && <div className="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2">
                    Already  have an account,<span className="text-blue-400 cursor-pointer" onClick={()=>{ setSignup(!signup);}}> SignIn Now</span>
                  </div>}
                </div>
                <div className="mx-auto max-w-xs">
                  <input
                    className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                    type="email"
                    placeholder="Email"
                    onChange={emailChangeHandler}
                  />
                  {signup && <input
                    className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                    type="text"
                    placeholder="Username"
                    onChange={userNameChangeHandler}
                  />}
                  <input
                    className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                    type="password"
                    placeholder="Password"
                    onChange={passwordChangeHandler}
                  />
                {signup && <button onClick={submitSignUpHandler} className="mt-5 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none">
                  
                  <span className="ml-3">Sign Up</span>

                  </button>                
                }
{           !signup &&      <button onClick={submitSigninHandler} className="mt-5 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none">
                  
                  <span className="ml-3">Sign In</span>

                  </button>}

                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 bg-indigo-100 text-center hidden lg:flex">
            <div
              className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat"
              style={{
                backgroundImage:
                  "url('https://storage.googleapis.com/devitary-image-host.appspot.com/15848031292911696601-undraw_designer_life_w96d.svg')",
              }}
            ></div>
          </div>
        </div>
      </div>
    );
}

  