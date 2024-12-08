import { jwtDecode } from "jwt-decode";
export const BACKEND_URL = "https://algoarena-server.onrender.com";
// export const BACKEND_URL = "http://localhost:3000";
export const extractUsername=()=>{
    const auth=localStorage.getItem("authorization")
    const token = auth.split(" ")[1];
    const decode=jwtDecode(token)
    return decode.username
}