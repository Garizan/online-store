import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchBookById } from "../api/booksApi";
import { addBookToCart } from "../utils/cartUtils";
import "./BookDetails.css";

export default function BookDetails() {
    const { id } = useParams();

    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const showMessage = (text) => {
        setMessage(text);

        setTimeout(() => {
            setMessage("");
        }, 2000);
    };

    useEffect(() => {
        const loadBook = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await fetchBookById(id);
                setBook(data);
            } catch (err) {
                console.error(err);
                setError("Failed to load book details");
            } finally {
                setLoading(false);
            }
        };

        loadBook();
    }, [id]);

    const handleAddToCart = () => {
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

    const handleBuyNow = () => {
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
            <div className="book-details-page">
                <p className="details-loading">Loading book...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="book-details-page">
                <p className="details-error">{error}</p>
            </div>
        );
    }

    if (!book) {
        return (
            <div className="book-details-page">
                <p className="details-error">Book not found</p>
            </div>
        );
    }

    return (
        <div className="book-details-page">
            {message && (
                <div className="cart-message">
                    {message}
                </div>
            )}

            <button
                className="back-btn"
                onClick={() => navigate("/")}
            >
                ← Back to catalog
            </button>

            <div className="book-details-card">
                <div className="book-details-cover">
                    📘
                </div>

                <div className="book-details-info">
                    <span className="details-badge">
                        {book.quantity > 0 ? "In stock" : "Out of stock"}
                    </span>

                    <h1>{book.title}</h1>

                    {book.author?.name && (
                        <p>✍️ <strong>Author:</strong> {book.author.name}</p>
                    )}

                    <p>🏷️ <strong>Genre:</strong> {book.genre}</p>
                    <p>💰 <strong>Price:</strong> {book.price} Lei</p>
                    <p>📦 <strong>In stock:</strong> {book.quantity}</p>

                    <p className="book-description">
                        This page contains detailed information about the selected book.
                        You can add it to the cart or buy it immediately.
                    </p>

                    <div className="details-actions">
                        <button
                            className="details-buy-btn"
                            onClick={handleBuyNow}
                            disabled={book.quantity <= 0}
                        >
                            Buy
                        </button>

                        <button
                            className="details-cart-btn"
                            onClick={handleAddToCart}
                            disabled={book.quantity <= 0}
                        >
                            Add to cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}