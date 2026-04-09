import { Routes, Route } from 'react-router-dom';
import Register from './components/Register';
import Books from "./components/Books";

function App() {
    return(
         <Routes>
             <Route path="/" element={<Books />} />
             <Route path="/register" element={<Register />} />
         </Routes>

    );
}

export default App;