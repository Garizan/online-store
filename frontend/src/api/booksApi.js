import axios from "axios";

export const fetchBooks = async () => {
    const { data } = await axios.get("/api/books");
    return data;
};