import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    getCart,
    removeBookFromCart,
    clearCart
} from "../utils/cartUtils";
import { checkoutOrder } from "../api/ordersApi";
import { getBookImage } from "../utils/bookImages";
import "./Cart.css";

export default function Cart() {
    const [cart, setCart] = useState([]);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            setMessage("Please log in to open your cart");

            setTimeout(() => {
                navigate("/login");
            }, 1200);

            return;
        }

        setCart(getCart());
    }, [navigate]);

    const showMessage = (text) => {
        setMessage(text);

        setTimeout(() => {
            setMessage("");
        }, 2500);
    };

    const handleRemove = (bookId) => {
        const updatedCart = removeBookFromCart(bookId);
        setCart(updatedCart);
    };

    const handleClearCart = () => {
        clearCart();
        setCart([]);
        showMessage("Cart cleared");
    };

    const handleCheckout = async () => {
        const token = localStorage.getItem("token");
        const customerId = localStorage.getItem("customerId");

        if (!token) {
            showMessage("Please log in to checkout");

            setTimeout(() => {
                navigate("/login");
            }, 1200);

            return;
        }

        if (!customerId) {
            setError("Customer ID not found. Please log in again.");
            return;
        }

        if (cart.length === 0) {
            setError("Your cart is empty");
            return;
        }

        const payload = {
            customerId: Number(customerId),
            items: cart.map((item) => ({
                bookId: item.id,
                quantity: item.cartQuantity
            }))
        };

        try {
            setLoading(true);
            setError("");

            await checkoutOrder(payload);

            clearCart();
            setCart([]);

            showMessage("Order placed successfully");
        } catch (err) {
            console.error(err);

            const backendMessage =
                err.response?.data?.message ||
                err.response?.data ||
                "Failed to place order";

            setError(backendMessage);
        } finally {
            setLoading(false);
        }
    };

    const totalPrice = cart.reduce((sum, item) => {
        return sum + Number(item.price) * item.cartQuantity;
    }, 0);

    if (cart.length === 0) {
        return (
            <div className="cart-page">
                {message && (
                    <div className="cart-message">
                        {message}
                    </div>
                )}

                <h1>Cart</h1>
                <p className="empty-cart">Your cart is empty</p>
            </div>
        );
    }

    return (
        <div className="cart-page">
            {message && (
                <div className="cart-message">
                    {message}
                </div>
            )}

            <h1>Cart</h1>

            {error && (
                <p className="cart-error">
                    {error}
                </p>
            )}

            <div className="cart-list">
                {cart.map((item) => (
                    <div className="cart-item" key={item.id}>
                        {item.imageUrl && (
                            <img
                                src={item.imageUrl}
                                alt={item.title}
                                className="cart-book-image"
                            />
                        )}

                        <div className="cart-item-info">
                            <h3>{item.title}</h3>
                            <p> Price: {item.price} Lei</p>
                            <p> Quantity: {item.cartQuantity}</p>
                        </div>

                        <button
                            className="remove-btn"
                            onClick={() => handleRemove(item.id)}
                        >
                            Remove
                        </button>
                    </div>
                ))}
            </div>

            <div className="cart-summary">
                <h2>Total: {totalPrice} Lei</h2>

                <button
                    className="clear-cart-btn"
                    onClick={handleClearCart}
                    disabled={loading}
                >
                    Clear cart
                </button>

                <button
                    className="checkout-btn"
                    onClick={handleCheckout}
                    disabled={loading}
                >
                    {loading ? "Processing..." : "Checkout"}
                </button>
            </div>
        </div>
    );
}