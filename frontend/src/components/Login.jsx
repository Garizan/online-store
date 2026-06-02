import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginCustomer } from "../api/authApi";
import "./Auth.css";

export default function Login({ setIsLoggedIn }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const onSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            setLoading(true);

            const data = await loginCustomer({ email, password });

            localStorage.setItem("token", data.token);
            localStorage.setItem("customerId", data.customerId);

            setIsLoggedIn(true);
            navigate("/", { replace: true });
        } catch (err) {
            setError(err.message || "Invalid email or password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h2>Login</h2>
                <p className="auth-subtitle">
                    Welcome back to Online Store
                </p>

                <form className="auth-form" onSubmit={onSubmit}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <button type="submit" disabled={loading}>
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                {error && <p className="auth-error">{error}</p>}

                <p className="auth-link">
                    Don&apos;t have an account?{" "}
                    <Link to="/register">Register</Link>
                </p>
            </div>
        </div>
    );
}