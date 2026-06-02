import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerCustomer } from "../api/authApi";
import "./Auth.css";

export default function Register({ setIsLoggedIn }) {
    const [name, setName] = useState("");
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

            const data = await registerCustomer({
                name,
                email,
                password
            });

            localStorage.setItem("token", data.token);
            localStorage.setItem("customerId", data.customerId);
            localStorage.setItem("role", data.role);

            setIsLoggedIn(true);
            navigate("/", { replace: true });
        } catch (err) {
            setError(err.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h2>Register</h2>
                <p className="auth-subtitle">
                    Create your Online Store account
                </p>

                <form className="auth-form" onSubmit={onSubmit}>
                    <input
                        type="text"
                        placeholder="Name"
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
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                    />

                    <button type="submit" disabled={loading}>
                        {loading ? "Registering..." : "Register"}
                    </button>
                </form>

                {error && <p className="auth-error">{error}</p>}

                <p className="auth-link">
                    Already have an account?{" "}
                    <Link to="/login">Login</Link>
                </p>
            </div>
        </div>
    );
}