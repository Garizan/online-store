import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { searchBooks } from "../api/booksApi";
import { addBookToCart } from "../utils/cartUtils";
import { getBookImage } from "../utils/bookImages";
import "./Search.css";

export default function Search() {
    const [query, setQuery] = useState("");
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const navigate = useNavigate();

    const showMessage = (text) => {
        setMessage(text);

        setTimeout(() => {
            setMessage("");
        }, 2000);
    };

    useEffect(() => {
        const q = query.trim();

        if (q.length === 0) {
            setBooks([]);
            setError("");
            return;
        }

        const timer = setTimeout(async () => {
            try {
                setLoading(true);
                setError("");

                const data = await searchBooks(q);
                setBooks(data);
            } catch (err) {
                console.error(err);
                setError("Failed to search books");
            } finally {
                setLoading(false);
            }
        }, 400);

        return () => clearTimeout(timer);
    }, [query]);

    const clearSearch = () => {
        setQuery("");
        setBooks([]);
        setError("");
    };

    const handleAddToCart = (book) => {
        const token = localStorage.getItem("token");

        if (!token) {
            showMessage("Please log in to add books to your cart");

            setTimeout(() => {
                navigate("/login");
            }, 1200);

            return;
        }

        try {
            addBookToCart(book);
            showMessage(`Book "${book.title}" added to cart`);
        } catch (err) {
            showMessage(err.message);
        }
    };

    const handleBuyNow = (book) => {
        const token = localStorage.getItem("token");

        if (!token) {
            showMessage("Please log in to buy books");

            setTimeout(() => {
                navigate("/login");
            }, 1200);

            return;
        }

        try {
            addBookToCart(book);
            navigate("/cart");
        } catch (err) {
            showMessage(err.message);
        }
    };

    return (
        <div className="search-page">
            {message && (
                <div className="cart-message">
                    {message}
                </div>
            )}

            <div className="search-container">
                <h1>Search Books</h1>

                <div className="search-form">
                    <input
                        type="text"
                        placeholder="Enter book title..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />

                    <button
                        type="button"
                        className="clear-btn"
                        onClick={clearSearch}
                    >
                        Clear
                    </button>
                </div>

                {error && <p className="search-error">{error}</p>}

                {loading && <p className="search-info">Searching...</p>}

                {!loading && query.trim() !== "" && books.length === 0 && (
                    <p className="search-info">No books found</p>
                )}

                <div className="search-results">
                    {books.map((book) => (
                        <div className="search-book-card" key={book.id}>
                            {book.imageUrl && (
                                <img
                                    src={book.imageUrl}
                                    alt={book.title}
                                    className="search-book-image"
                                />
                            )}

                            <h3>{book.title}</h3>

                            <div className="search-book-info">
                                {book.author?.name && (
                                    <p> Author: {book.author.name}</p>
                                )}

                                <p> Genre: {book.genre}</p>
                                <p> Price: {book.price} Lei</p>
                                <p> In stock: {book.quantity}</p>
                            </div>

                            <div className="search-book-actions">
                                <button
                                    className="search-buy-btn"
                                    onClick={() => handleBuyNow(book)}
                                >
                                    Buy
                                </button>

                                <button
                                    className="search-cart-btn"
                                    onClick={() => handleAddToCart(book)}
                                >
                                    🛒
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}