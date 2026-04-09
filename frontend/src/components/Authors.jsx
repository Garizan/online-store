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
            setError('Не удалось загрузить авторов');
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
            setError('Не удалось выполнить поиск');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="authors-page">
            <div className="authors-card">
                <h2>Поиск авторов</h2>

                {error && <div className="error-box">{error}</div>}

                <form className="author-form" onSubmit={handleSearch}>
                    <input
                        type="text"
                        placeholder="Введите имя автора"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <button type="submit">Найти</button>
                    <button type="button" onClick={loadAuthors}>Сброс</button>
                </form>

                {loading ? (
                    <p className="empty">Загрузка...</p>
                ) : authors.length === 0 ? (
                    <p className="empty">Авторы не найдены</p>
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