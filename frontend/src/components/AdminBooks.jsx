import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createBook, deleteBook, fetchBooks } from "../api/booksApi";
import "./AdminBooks.css";

export default function AdminBooks() {
    const [books, setBooks] = useState([]);

    const [form, setForm] = useState({
        title: "",
        authorId: "",
        genre: "FANTASY",
        price: "",
        quantity: "",
        imageUrl: ""
    });

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [bookToDelete, setBookToDelete] = useState(null);

    const navigate = useNavigate();

    const genres = [
        "CLASSIC",
        "FANTASY",
        "DETECTIVE",
        "HORROR",
        "ROMANCE",
        "SCIENCE",
        "PROGRAMMING",
        "HISTORY",
        "BIOGRAPHY",
        "ADVENTURE"
    ];

    useEffect(() => {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");

        if (!token) {
            navigate("/login");
            return;
        }

        if (role !== "ADMIN") {
            navigate("/");
        }
    }, [navigate]);

    const loadBooks = async () => {
        try {
            const data = await fetchBooks();
            setBooks(data);
        } catch (err) {
            console.error(err);
            setError("Failed to load books");
        }
    };

    useEffect(() => {
        loadBooks();
    }, []);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleCreate = async (e) => {
        e.preventDefault();

        const payload = {
            title: form.title,
            genre: form.genre,
            price: Number(form.price),
            quantity: Number(form.quantity),
            imageUrl: form.imageUrl,
            author: {
                id: Number(form.authorId)
            }
        };

        try {
            setError("");
            setMessage("");

            await createBook(payload);

            setMessage("Book added successfully");

            setForm({
                title: "",
                authorId: "",
                genre: "FANTASY",
                price: "",
                quantity: "",
                imageUrl: ""
            });

            loadBooks();
        } catch (err) {
            console.error(err);

            const backendMessage =
                err.response?.data?.message ||
                "Failed to add book";

            setError(backendMessage);
        }
    };

    const openDeleteConfirm = (book) => {
        setBookToDelete(book);
    };

    const handleDelete = async () => {
        if (!bookToDelete) {
            return;
        }

        try {
            setError("");
            setMessage("");

            await deleteBook(bookToDelete.id);

            setMessage(`Book "${bookToDelete.title}" deleted successfully`);
            setBookToDelete(null);

            loadBooks();
        } catch (err) {
            console.error(err);

            const backendMessage =
                err.response?.data?.message ||
                "Failed to delete book";

            setError(backendMessage);
            setBookToDelete(null);
        }
    };

    return (
        <div className="admin-page">
            <h1>Admin Panel</h1>

            {message && <p className="admin-message">{message}</p>}
            {error && <p className="admin-error">{error}</p>}

            {bookToDelete && (
                <div className="delete-confirm-overlay">
                    <div className="delete-confirm-box">
                        <h2>Delete book</h2>

                        <p>
                            Are you sure you want to delete
                            <strong> "{bookToDelete.title}"</strong>?
                        </p>

                        <div className="delete-confirm-actions">
                            <button
                                className="cancel-delete-btn"
                                onClick={() => setBookToDelete(null)}
                            >
                                Cancel
                            </button>

                            <button
                                className="confirm-delete-btn"
                                onClick={handleDelete}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="admin-layout">
                <form className="admin-form" onSubmit={handleCreate}>
                    <h2>Add Book</h2>

                    <input
                        name="title"
                        type="text"
                        placeholder="Title"
                        value={form.title}
                        onChange={handleChange}
                        required
                    />

                    <input
                        name="authorId"
                        type="number"
                        placeholder="Author ID"
                        value={form.authorId}
                        onChange={handleChange}
                        required
                    />

                    <select
                        name="genre"
                        value={form.genre}
                        onChange={handleChange}
                        required
                    >
                        {genres.map((genre) => (
                            <option key={genre} value={genre}>
                                {genre}
                            </option>
                        ))}
                    </select>

                    <input
                        name="price"
                        type="number"
                        placeholder="Price"
                        value={form.price}
                        onChange={handleChange}
                        required
                    />

                    <input
                        name="quantity"
                        type="number"
                        placeholder="Quantity"
                        value={form.quantity}
                        onChange={handleChange}
                        required
                    />

                    <input
                        name="imageUrl"
                        type="text"
                        placeholder="Image URL, example: /images/books/hobbit.jpg"
                        value={form.imageUrl}
                        onChange={handleChange}
                    />

                    <button type="submit">
                        Add book
                    </button>
                </form>

                <div className="admin-books">
                    <h2>Books</h2>

                    {books.map((book) => (
                        <div className="admin-book-item" key={book.id}>
                            {book.imageUrl && (
                                <img
                                    src={book.imageUrl}
                                    alt={book.title}
                                    className="admin-book-image"
                                />
                            )}
                            <div>
                                <h3>{book.title}</h3>
                                <p>ID: {book.id}</p>

                                {book.author?.name && (
                                    <p>Author: {book.author.name}</p>
                                )}

                                <p>Genre: {book.genre}</p>
                                <p>Price: {book.price} Lei</p>
                                <p>Quantity: {book.quantity}</p>
                            </div>

                            <button onClick={() => openDeleteConfirm(book)}>
                                Delete
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}