import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ContestArea from './ContestArea';
import Landing from './Landing';
import Hero from './Hero';

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/:userName" element={<Landing />} />
                <Route path="/" element={<Hero/>} />
                <Route path="/contest/:userName/:roomID" element={<ContestArea />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
