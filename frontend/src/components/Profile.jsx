import { useEffect, useState } from 'react';
import { BACKEND_URL, extractUsername } from '../../utils';
import axios from 'axios';

export default function Profile() {
    const username = extractUsername();
    const[user,setUser]=useState();
    const [totalContest,setTotalcontest]=useState(0);
    const [rank,setRank]=useState("");
    const [wins,setWins]=useState(0);
    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await axios.get(`${BACKEND_URL}/user/profile`, {
                    params: { username }
                });
                if(response)
                {
                    setUser(response.data);
        
                }
            } catch (error) {
                console.error("Error fetching user details:", error);
            }
        };
        fetchUserDetails();
       
    }, [username]);
    useEffect(() => {
        if (user) {
            console.log(user);
            setRank(user.rank);
            setTotalcontest(user.history.length);
            setWins(user.wins)
        }
    }, [user]);

  return (
    <div className="p-6">
      <section id="userProfile" className="p-6">
    <div className="bg-white rounded-lg border border-neutral-200 mb-6" id="el-5wquqpkg">
        <div className="p-6" id="el-krqimvs1">
            <div className="flex flex-col md:flex-row items-center md:items-start" id="el-7v01dqxd">
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center" id="el-2prj8ybs">
                    <svg className="w-12 h-12 text-gray-500" fill="currentColor" viewBox="0 0 20 20" id="el-bmidua45">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" id="el-bsu5esv4"></path>
                    </svg>
                </div>
                <div className="mt-4 md:mt-0 md:ml-6 text-center md:text-left" id="el-5j05bib6">
                    <h1 className="text-2xl font-bold text-gray-900" id="el-5uu4uxje">{username}</h1>
                    <p className="text-gray-500" id="el-uk6wclfs">@{username}</p>
                    <div className="mt-2 flex flex-wrap justify-center md:justify-start gap-2" id="el-1wde50l7">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full" id="el-qvdwc8hb">Advanced</span>
                        <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm font-medium rounded-full" id="el-garj8pl3">Python Expert</span>
                        <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full" id="el-kv3pz80q">Contest Winner</span>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6" id="el-bloe2m7a">
       

        <div className="bg-white p-6 rounded-lg border border-neutral-200" id="el-axptl6gx">
            <div className="flex items-center" id="el-gdrjh5hd">
                <div className="p-2 rounded-full bg-green-100" id="el-1eq3l47p">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" id="el-vt4b6c9e">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" id="el-49p5uwtf"></path>
                    </svg>
                </div>
                <div className="ml-4" id="el-tl3g4794">
                    <p className="text-sm text-gray-500" id="el-waxdps8k">Wins</p>
                    <p className="text-xl font-semibold" id="el-dgouytwv">{wins}</p>
                </div>
            </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-neutral-200" id="el-ogfc5uhr">
            <div className="flex items-center" id="el-bwxfwot1">
                <div className="p-2 rounded-full bg-yellow-100" id="el-tg66iis7">
                    <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" id="el-azt8j1uy">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" id="el-nv2ps05y"></path>
                    </svg>
                </div>
                <div className="ml-4" id="el-f8n9vq99">
                    <p className="text-sm text-gray-500" id="el-8f2alfpk">Contests</p>
                    <p className="text-xl font-semibold" id="el-95zfrjs0">{totalContest}</p>
                </div>
            </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-neutral-200" id="el-eb78wps8">
            <div className="flex items-center" id="el-byc44gu5">
                <div className="p-2 rounded-full bg-purple-100" id="el-96f2vd94">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" id="el-9hvd6w85">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" id="el-4txj9kwc"></path>
                    </svg>
                </div>
                <div className="ml-4" id="el-8000g4m8">
                    <p className="text-sm text-gray-500" id="el-4mim1qiq">Rank</p>
                    <p className="text-xl font-semibold" id="el-t1uepi7v">{rank.toUpperCase()}</p>
                </div>
            </div>
        </div>
    </div>

   
        </section>
        <section>
        <section id="dashboard" className="p-6">
    

    <div className="bg-white rounded-lg border border-neutral-200 mb-6" id="el-qh4kl1k0">
        <div className="p-6 border-b border-neutral-200" id="el-r79vdbou">
            <h2 className="text-lg font-semibold" id="el-uqvboa05">Recent Contests</h2>
        </div>
        <div className="overflow-x-auto" id="el-unqgb88z">
            <table className="w-full" id="el-gjff8v4a">
                <thead className="bg-gray-50" id="el-wuv7vvjg">
                    <tr id="el-fomhpv69">
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" id="el-c4hoe6j7">Contest</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" id="el-3d82fl0k">Status</th>
                    </tr>
                </thead>
                
                <tbody>
                
                {user && user.history && user.history.length>0 && user.history.map((contest, index) => (
                            <tr key={index}>
                                <td className="px-6 py-4">
                                    <div className="text-sm font-medium text-gray-900">{contest.opponent}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                        ${contest.status === "win" ? "bg-green-100 text-green-800" :
                                            contest.status === "loose" ? "bg-red-100 text-yellow-800" :
                                                "bg-gray-100 text-gray-800"}`}>
                                        {contest.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>
        </div>
    </div>

   
</section>
        </section>
    </div>
  )
}
