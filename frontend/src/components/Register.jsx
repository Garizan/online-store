import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {registerCustomer} from '../api/authApi';

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const onSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        try {
            setLoading(true);
            const data = await registerCustomer({ name, email, password });
            localStorage.setItem('token', data.token);

            // редирект на страницу книг
            navigate('/', { replace: true });
        } catch (err) {
            setError(err.message || 'Ошибка регистрации');
        } finally {
            setLoading(false);
        }
    };

return (
    <div style={{maxWidth: 420, margin: '40px auto'}}>
        <h2>Регистрация</h2>

        <form onSubmit={onSubmit} style={{display: 'grid', gap: 10}}>
            <input
                type="text"
                placeholder="Имя"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
            />
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <input
                type="password"
                placeholder="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
            />
            <button type="submit" disabled={loading}>
                {loading ? 'Регистрация...' : 'Зарегистрироваться'}
            </button>
        </form>

        {message && <p style={{color: 'green'}}>{message}</p>}
        {error && <p style={{color: 'crimson'}}>{error}</p>}
    </div>
);
}