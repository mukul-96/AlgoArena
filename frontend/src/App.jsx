import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ContestArea from './components/ContestArea';
import Landing from './components/Landing';
import Hero from './components/Hero';
import Signin from './components/Signin';

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/:userName/landing" element={<Landing />} />
                <Route path="/signin" element={<Signin />} />
                {/* <Route path="/" element={<Hero/>} /> */}
                <Route path="/contest/:userName/:roomID" element={<ContestArea />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
