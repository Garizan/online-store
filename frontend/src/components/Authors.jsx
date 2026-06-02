import { useEffect, useState } from 'react';
import { getAuthors, searchAuthors } from '../api/authorsApi';
import './Authors.css';

export default function Authors() {
    const [authors, setAuthors] = useState([]);
    const [search, setSearch] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const loadAuthors = async () => {
        try {
            setLoading(true);
            setError('');
            setAuthors(await getAuthors());
        } catch {
            setError('Failed to load authors');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAuthors();
    }, []);

    const handleSearch = async (e) => {
        e.preventDefault();
        const q = search.trim();

        try {
            setLoading(true);
            setError('');
            setAuthors(q ? await searchAuthors(q) : await getAuthors());
        } catch {
            setError('Failed to search authors');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="authors-page">
            <div className="authors-card">
                <h2>Search Authors</h2>

                {error && <div className="error-box">{error}</div>}

                <form className="author-form" onSubmit={handleSearch}>
                    <input
                        type="text"
                        placeholder="Enter author name"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <button type="submit">Search</button>
                    <button type="button" onClick={loadAuthors}>Reset</button>
                </form>

                {loading ? (
                    <p className="empty">Loading...</p>
                ) : authors.length === 0 ? (
                    <p className="empty">No authors found</p>
                ) : (
                    <ul className="authors-list">
                        {authors.map((author) => (
                            <li key={author.id} className="author-item">
                                <span>{author.name}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}