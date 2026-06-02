import { Routes, Route, useNavigate} from 'react-router-dom';
import { useState } from 'react';
import Register from './components/Register';
import Books from "./components/Books";
import Login from './components/Login';
import Header from './components/Header';
import Search from './components/Search';
import Cart from './components/Cart';
import Footer from "./components/Footer.jsx";
import BookDetails from './components/BookDetails';
import Orders from './components/Orders';

function App() {

    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
    return(
        <>
            <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
            <Routes>
                <Route path="/" element={<Books />} />
                <Route path="/books/:id" element={<BookDetails />} />
                <Route path="/search" element={<Search />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
                <Route path="/register" element={<Register setIsLoggedIn={setIsLoggedIn} />} />
            </Routes>

            <Footer />
        </>
    );
}

export default App;