import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div>
                    <h3>📚 Online Store</h3>
                    <p>Book catalog and online ordering system.</p>
                </div>

            </div>

            <div className="footer-bottom">
                <p>© 2026 Online Store. Developed by Garizan Fiodor.</p>
            </div>
        </footer>
    );
}