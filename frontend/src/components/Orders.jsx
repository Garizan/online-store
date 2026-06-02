import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchCustomerOrders } from "../api/ordersApi";
import "./Orders.css";

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        const loadOrders = async () => {
            const token = localStorage.getItem("token");
            const customerId = localStorage.getItem("customerId");

            if (!token) {
                navigate("/login");
                return;
            }

            if (!customerId) {
                setError("Customer ID not found. Please log in again.");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError("");

                const data = await fetchCustomerOrders(customerId);
                setOrders(data);
            } catch (err) {
                console.error(err);
                setError("Failed to load orders");
            } finally {
                setLoading(false);
            }
        };

        loadOrders();
    }, [navigate]);

    const getOrderTotal = (order) => {
        return order.items.reduce((sum, item) => {
            return sum + Number(item.book.price) * item.quantity;
        }, 0);
    };

    if (loading) {
        return (
            <div className="orders-page">
                <p>Loading orders...</p>
            </div>
        );
    }

    return (
        <div className="orders-page">
            <h1>Order History</h1>

            {error && <p className="orders-error">{error}</p>}

            {orders.length === 0 ? (
                <div className="orders-empty">
                    <p>You have no orders yet.</p>

                    <button onClick={() => navigate("/")}>
                        Go to catalog
                    </button>
                </div>
            ) : (
                <div className="orders-list">
                    {orders.map((order) => (
                        <div className="order-card" key={order.id}>
                            <div className="order-header">
                                <h2>Order #{order.id}</h2>
                                <span>Total: {getOrderTotal(order)} Lei</span>
                            </div>

                            <div className="order-items">
                                {order.items.map((item) => (
                                    <div className="order-item" key={item.id}>
                                        <div>
                                            <h3>{item.book.title}</h3>

                                            {item.book.author?.name && (
                                                <p>Author: {item.book.author.name}</p>
                                            )}

                                            <p>Quantity: {item.quantity}</p>
                                            <p>Price: {item.book.price} Lei</p>
                                        </div>

                                        <strong>
                                            {Number(item.book.price) * item.quantity} Lei
                                        </strong>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}