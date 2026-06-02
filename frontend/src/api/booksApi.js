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