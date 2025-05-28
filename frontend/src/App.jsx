import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ContestArea from './components/ContestArea';
import Home from './components/Home';
import Signin from './components/Signin';
import AddProblem from './components/AddProblem';
import Landing from './components/Landing';
import Profile from './components/Profile';

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/:userName/home" element={<Home />} />
                <Route path="/:userName/profile" element={<Profile />} />
                <Route path="/" element={<Landing />} />
                <Route path="admin/addproblem" element={<AddProblem />} />
                <Route path="/signin" element={<Signin />} />
                <Route path="/contest/:userName/:roomID/:matchType" element={<ContestArea />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
