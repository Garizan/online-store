import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import "./Header.css";

export default function Header({ isLoggedIn, setIsLoggedIn }) {
    const navigate = useNavigate();

    const [menuOpen, setMenuOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);

    const menuRef = useRef(null);
    const profileRef = useRef(null);

    const role = localStorage.getItem("role");
    const isAdmin = role === "ADMIN";

    const getEmail = () => {
        const token = localStorage.getItem("token");

        if (!token) {
            return null;
        }

        try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            return payload.sub;
        } catch {
            return null;
        }
    };

    const email = getEmail();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                profileRef.current &&
                !profileRef.current.contains(event.target)
            ) {
                setProfileOpen(false);
            }

            if (
                menuRef.current &&
                !menuRef.current.contains(event.target)
            ) {
                setMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("customerId");
        localStorage.removeItem("cart");
        localStorage.removeItem("role");

        setIsLoggedIn(false);
        setProfileOpen(false);

        navigate("/login");
    };

    const goTo = (path) => {
        navigate(path);
        setMenuOpen(false);
    };

    return (
        <header className="header">
            <div className="header-left" ref={menuRef}>
                <button
                    className="burger-btn"
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    ☰
                </button>

                <Link to="/" className="logo">
                    📚 Online Store
                </Link>

                {menuOpen && (
                    <div className="burger-menu">
                        <button onClick={() => goTo("/")}>
                            📚 Catalog
                        </button>

                        <button onClick={() => goTo("/search")}>
                            🔍 Search
                        </button>

                        <button onClick={() => goTo("/cart")}>
                            🛒 Cart
                        </button>

                        <button onClick={() => goTo("/orders")}>
                            📦 Orders
                        </button>

                        {isAdmin && (
                            <button onClick={() => goTo("/admin/books")}>
                                ⚙️ Admin
                            </button>
                        )}
                    </div>
                )}
            </div>

            {isLoggedIn && email ? (
                <div className="profile" ref={profileRef}>
                    <button
                        className="profile-btn"
                        onClick={() => setProfileOpen(!profileOpen)}
                    >
                        {email[0].toUpperCase()}
                    </button>

                    {profileOpen && (
                        <div className="profile-menu">
                            <p className="profile-title">Profile</p>
                            <p className="profile-email">{email}</p>

                            <hr />

                            <button
                                className="logout-btn"
                                onClick={logout}
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <Link to="/login" className="login-btn">
                    Login
                </Link>
            )}
        </header>
    );
}