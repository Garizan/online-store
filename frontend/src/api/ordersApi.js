import axios from "axios";

export const checkoutOrder = async (payload) => {
    const token = localStorage.getItem("token");

    const { data } = await axios.post("/api/orders/checkout", payload, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    });

    return data;
};

export const fetchCustomerOrders = async (customerId) => {
    const token = localStorage.getItem("token");

    const { data } = await axios.get(`/api/orders/customer/${customerId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    return data;
};