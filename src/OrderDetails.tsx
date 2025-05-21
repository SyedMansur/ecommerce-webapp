import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface OrderResponse {
    orderId: number;
    productName: string;
    totalPrice: number;
    totalQuantity: number;
    status: string;
    productDesc: string;
    imageURL: string;
}

const OrderDetails: React.FC = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user?.userId;

    const [orders, setOrders] = useState<OrderResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [cancelMessage, setCancelMessage] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch(`http://localhost:8001/order/${userId}`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" }
                });

                if (!response.ok) throw new Error("No orders found");

                const data: OrderResponse[] = await response.json();
                setOrders(data);
            } catch (error) {
                setError("Failed to fetch orders. Please try again.");
                console.error("Error fetching orders:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [userId]);

    const handleCancelOrder = async (orderId: number) => {
        try {
            const response = await fetch(`http://localhost:8001/order/cancel/${orderId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" }
            });
    
            if (!response.ok) throw new Error("Failed to cancel order");
    
            // ✅ Immediately update the status in state
            setOrders(prevOrders =>
                prevOrders.map(order =>
                    order.orderId === orderId ? { ...order, status: "Cancelled" } : order
                )
            );
    
        } catch (error) {
            console.error("Error cancelling order:", error);
        }
    };
    

    if (loading) return <p>Loading orders...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Order Details</h2>

            {cancelMessage && <p style={styles.cancelMessage}>{cancelMessage}</p>}

            {orders.length === 0 ? (
                <p style={styles.noOrders}>No orders found.</p>
            ) : (
                <div style={styles.orderGrid}>
                    {orders.map((order, index) => (
                        <div key={index} style={styles.orderCard}>
                            <img
                                src={order.imageURL || "https://via.placeholder.com/80"}
                                alt={order.productName}
                                style={styles.image}
                            />
                            <div style={styles.cardContent}>
                                <h3 style={styles.productName}>{order.productName}</h3>
                                <p style={styles.productDesc}>{order.productDesc}</p>
                                <p><strong>Quantity:</strong> {order.totalQuantity}</p>
                                <p><strong>Total Price:</strong> ₹{order.totalPrice}</p>
                                <p><strong>Status:</strong>
                                    <span style={order.status === "Cancelled" ? styles.cancelledText : {}}>
                                        {order.status}
                                    </span>
                                </p>

                                <button 
    style={order.status === "Cancelled" ? styles.disabledButton : styles.cancelButton} 
    onClick={() => handleCancelOrder(order.orderId)} 
    disabled={order.status === "Cancelled"}
>
    {order.status === "Cancelled" ? "Cancelled" : "Cancel Order"}
</button>


                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const styles = {
    container: {
        padding: "20px",
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
        maxWidth: "1000px",
        margin: "auto",
    },
    title: {
        fontSize: "28px",
        fontWeight: "bold",
        marginBottom: "20px",
        textAlign: "center" as const, // ✅ Fix: Explicitly define `textAlign`
        color: "#333",
    },
    orderGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", // Adjusts for smaller cards
        gap: "15px", // Reduces spacing between items
    },
    orderCard: {
        background: "#fff",
        padding: "10px", // Reduced padding for compact look
        borderRadius: "8px",
        boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)", // Lighter shadow
        width: "260px", // Smaller card width
        transition: "transform 0.3s",
    },
    cardContent: {
        padding: "10px",
    },
    image: {
        width: "100%",
        height: "150px",
        objectFit: "contain" as const, // ✅ Fix: Explicitly define `objectFit`
        borderRadius: "6px",
    },
    productName: {
        fontSize: "16px", // Smaller font size
        fontWeight: "bold",
        color: "#333",
    },

    productDesc: {
        fontSize: "12px", // Smaller text for a clean design
        color: "#666",
    },
    cancelledText: {
        color: "#b0b0b0",
        fontStyle: "italic",
    },
    cancelButton: {
        backgroundColor: "#ff4d4d", // Red color when active
        color: "#fff",
        border: "none",
        padding: "10px",
        borderRadius: "5px",
        cursor: "pointer",
        width: "100%",
        fontSize: "16px",
        transition: "background 0.3s ease",
    },
    disabledButton: {
        backgroundColor: "#b0b0b0", // Gray color when disabled
        color: "#fff",
        border: "none",
        padding: "10px",
        borderRadius: "5px",
        width: "100%",
        fontSize: "16px",
        cursor: "not-allowed",
    },
    cancelMessage: {
        color: "#ff4d4d",
        fontWeight: "bold",
        marginBottom: "20px",
        textAlign: "center" as const, // ✅ Fixes TypeScript error
    },
    noOrders: {
        textAlign: "center" as const, // ✅ Fix: Ensures TypeScript recognizes "center"
        fontSize: "18px",
        color: "#666",
    }
};

export default OrderDetails;
