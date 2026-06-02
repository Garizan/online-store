import axios from "axios";

export const fetchBooks = async () => {
    const { data } = await axios.get("/api/books");
    return data;
};

export const searchBooks = async (title) => {
    const { data } = await axios.get(
        `/api/books/search?title=${encodeURIComponent(title)}`
    );
    return data;
};

export const fetchBookById = async (id) => {
    const { data } = await axios.get(`/api/books/${id}`);
    return data;
};

export const createBook = async (book) => {
    const token = localStorage.getItem("token");

    const { data } = await axios.post("/api/books", book, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    });

    return data;
};

export const deleteBook = async (id) => {
    const token = localStorage.getItem("token");

    await axios.delete(`/api/books/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};