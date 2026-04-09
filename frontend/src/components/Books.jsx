import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchBooks } from "../api/booksApi";
import "./Books.css";

export default function Books() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const loadBooks = async () => {
            try {
                const data = await fetchBooks();
                setBooks(data);
            } catch (e) {
                console.error("Ошибка загрузки книг:", e);
            } finally {
                setLoading(false);
            }
        };

        loadBooks();
    }, []);

    if (loading) return <p>Загрузка книг...</p>;

    return (
        <div className="books-page">
            <button className="register-btn" onClick={() => navigate("/register")}>
                Зарегистрироваться
            </button>
            <h1>Каталог книг</h1>

            <div className="books-grid">
                {books.map((book) => (
                    <div className="book-card" key={book.id}>
                        <h3>{book.title}</h3>
                        <p>💰 Цена: {book.price} ₽</p>
                        <p>📦 В наличии: {book.quantity}</p>
                        <button>Купить</button>
                    </div>
                ))}
            </div>
        </div>
    );
}