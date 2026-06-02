import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchBooks } from "../api/booksApi";
import { addBookToCart } from "../utils/cartUtils";
import "./Books.css";

export default function Books() {
    const [books, setBooks] = useState([]);
    const [sortedBooks, setSortedBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortType, setSortType] = useState("default");
    const [message, setMessage] = useState("");
    const [genreFilter, setGenreFilter] = useState("all");

    const navigate = useNavigate();

    const genres = [
        "all",
        ...new Set(books.map((book) => book.genre).filter(Boolean))
    ];

    const showMessage = (text) => {
        setMessage(text);

        setTimeout(() => {
            setMessage("");
        }, 2000);
    };

    useEffect(() => {
        const loadBooks = async () => {
            try {
                const data = await fetchBooks();
                setBooks(data);
                setSortedBooks(data);
            } catch (e) {
                console.error("Error loading books:", e);
            } finally {
                setLoading(false);
            }
        };

        loadBooks();
    }, []);

    useEffect(() => {
        let result = [...books];

        if (genreFilter !== "all") {
            result = result.filter((book) => book.genre === genreFilter);
        }

        if (sortType === "cheap") {
            result.sort((a, b) => Number(a.price) - Number(b.price));
        }

        if (sortType === "expensive") {
            result.sort((a, b) => Number(b.price) - Number(a.price));
        }

        setSortedBooks(result);
    }, [sortType, genreFilter, books]);

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

    if (loading) {
        return (
            <div className="books-page">
                <p className="loading-text">Loading books...</p>
            </div>
        );
    }

    return (
        <div className="books-page">
            {message && (
                <div className="cart-message">
                    {message}
                </div>
            )}

            <section className="hero">
                <div>
                    <p className="hero-badge">📚 Online Book Store</p>
                    <h1>Find Your Next Book</h1>
                    <p className="hero-text">
                        A catalog of popular books, classics, fantasy, and detective stories.
                        Choose, add to cart, and place your order.
                    </p>
                </div>
            </section>

            <section className="catalog-panel">
                <div className="catalog-header">
                    <div>
                        <h2>Book Catalog</h2>
                        <p>Total books: {sortedBooks.length}</p>
                    </div>

                    <div className="catalog-controls">
                        <select
                            value={genreFilter}
                            onChange={(e) => setGenreFilter(e.target.value)}
                        >
                            {genres.map((genre) => (
                                <option key={genre} value={genre}>
                                    {genre === "all" ? "All genres" : genre}
                                </option>
                            ))}
                        </select>

                        <select
                            value={sortType}
                            onChange={(e) => setSortType(e.target.value)}
                        >
                            <option value="default">No sorting</option>
                            <option value="cheap">Cheapest first</option>
                            <option value="expensive">Most expensive first</option>
                        </select>
                    </div>
                </div>

                {sortedBooks.length === 0 ? (
                    <p className="empty-books">No books found</p>
                ) : (
                    <div className="books-grid">
                        {sortedBooks.map((book) => (
                            <div className="book-card" key={book.id}>
                                <div className="book-top">
                                    <span className="book-badge">
                                        {book.quantity > 5
                                            ? "In stock"
                                            : "Only a few left"}
                                    </span>
                                </div>

                                <h3>{book.title}</h3>

                                <div className="book-info">
                                    {book.author?.name && (
                                        <p>✍️ Author: {book.author.name}</p>
                                    )}

                                    <p>🏷️ Genre: {book.genre}</p>
                                    <p>💰 Price: {book.price} Lei</p>
                                    <p>📦 In stock: {book.quantity}</p>
                                </div>

                                <div className="book-actions">
                                    <button
                                        className="details-btn"
                                        onClick={() => navigate(`/books/${book.id}`)}
                                    >
                                        Details
                                    </button>

                                    <button
                                        className="buy-btn"
                                        onClick={() => handleBuyNow(book)}
                                    >
                                        Buy
                                    </button>

                                    <button
                                        className="cart-btn"
                                        title="Add to cart"
                                        onClick={() => handleAddToCart(book)}
                                    >
                                        🛒
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}