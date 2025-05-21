import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface CartItem {
    id: string;
    userId?: number;
    productQty: { [productId: string]: number };
    totalQuantity: number;
    totalPrice: number;
    productName?: string;
    productDesc?: string;
    productPrice?: number;
    prodCat?: string;
    imageURL?: string;
}


const CartDetails = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const initialCartData: CartItem[] = location.state?.cartData || [];
    const [cartData, setCartData] = useState<CartItem[]>(initialCartData);
    const [deleteMessage, setDeleteMessage] = useState<string | null>(null);

    const [selectedItems, setSelectedItems] = useState<string[]>(() => {
        return initialCartData.flatMap(cart =>
            Object.keys(cart.productQty).map(productId => `${cart.id}-${productId}`)
        );
    });

useEffect(() => {
  window.scrollTo(0, 0);
}, []);

    const handleSelect = (cartId: string, productId: string) => {
        const key = `${cartId}-${productId}`;
        setSelectedItems(prev =>
            prev.includes(key) ? prev.filter(id => id !== key) : [...prev, key]
        );
    };

    const selectedTotal = cartData.reduce((total, cart) => {
        return total + Object.entries(cart.productQty).reduce((subTotal, [productId, qty]) => {
            const key = `${cart.id}-${productId}`;
            return selectedItems.includes(key)
                ? subTotal + (cart.productPrice || 0) * qty
                : subTotal;
        }, 0);
    }, 0);


    const handleBackClick = () => navigate(-1);

    const handleIncrease = (cartId: string, productId: string) => {
        setCartData(prev =>
            prev.map(cart => {
                if (cart.id === cartId) {
                    const unitPrice = cart.productPrice || 0;
                    return {
                        ...cart,
                        productQty: {
                            ...cart.productQty,
                            [productId]: cart.productQty[productId] + 1,
                        },
                        totalQuantity: cart.totalQuantity + 1,
                        totalPrice: cart.totalPrice + unitPrice,
                    };
                }
                return cart;
            })
        );
    };


    const handleDecrease = (cartId: string, productId: string) => {
        setCartData(prev =>
            prev.map(cart => {
                const currentQty = cart.productQty[productId];
                if (cart.id === cartId && currentQty > 1) {
                    const unitPrice = cart.productPrice || 0;
                    return {
                        ...cart,
                        productQty: {
                            ...cart.productQty,
                            [productId]: currentQty - 1,
                        },
                        totalQuantity: cart.totalQuantity - 1,
                        totalPrice: cart.totalPrice - unitPrice,
                    };
                }
                return cart;
            })
        );
    };


    const handleDelete = async (cartId: string, productId: string, productName: string) => {
        try {
            const response = await fetch(`http://localhost:8001/cart/${cartId}/${productId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete item from cart');
            }

            // Show success message
            setDeleteMessage(`Product ${productName} removed from cart.`);
            setTimeout(() => setDeleteMessage(null), 3000);

            // Update local state
            setCartData(prev => {
                const updated = prev.map(cart => {
                    if (cart.id === cartId) {
                        const { [productId]: _, ...rest } = cart.productQty;
                        const removedQty = cart.productQty[productId];
                        const unitPrice = cart.productPrice || 0;

                        if (Object.keys(rest).length === 0) return null;

                        return {
                            ...cart,
                            productQty: rest,
                            totalQuantity: cart.totalQuantity - removedQty,
                            totalPrice: cart.totalPrice - removedQty * unitPrice,
                        };
                    }
                    return cart;
                });

                return updated.filter((cart): cart is CartItem => cart !== null);
            });
        } catch (error) {
            console.error('Error deleting item:', error);
            setDeleteMessage('Failed to delete item. Please try again.');
            setTimeout(() => setDeleteMessage(null), 3000);
        }
    };


    return (
        <div className="cart-page">
            <header className="cart-header">
                <h1>🛒 Cart Details</h1>
                <button className="back-button" onClick={handleBackClick}>← Back</button>
            </header>

            <main className="cart-content">
                {deleteMessage && (
                    <div className="top-toast">
                        <span className="check-icon">✔</span>
                        <span>{deleteMessage}</span>
                        <button className="close-toast" onClick={() => setDeleteMessage(null)}>✖</button>
                    </div>
                )}

                {cartData.length === 0 ? (
                    <p className="empty-message">No cart details available.</p>
                ) : (
                    <div className="cart-list">
                        {cartData.map((item: CartItem) => (
                            <div key={item.id} className="cart-card">
                                {/* <h3>Cart ID: {item.id}</h3> */}
                                {Object.entries(item.productQty).map(([productId, quantity]) => {
                                    const isSelected = selectedItems.includes(`${item.id}-${productId}`);
                                    return (
                                        <div key={productId} className="product-info">
                                            <input
                                                type="checkbox"
                                                checked={isSelected}
                                                onChange={() => handleSelect(item.id, productId)}
                                                className="product-checkbox"
                                            />
                                            {item.imageURL && (
                                                <img src={item.imageURL} alt={item.productName || 'Product'} className="product-image" />
                                            )}
                                            <div className="product-details">
                                                <p className="product-name">{item.productName}</p>
                                                <p className="product-desc">{item.productDesc}</p>
                                                <p className="product-meta"><strong>Category:</strong> {item.prodCat}</p>
                                                <p className="product-meta"><strong>Unit Price:</strong> ₹{item.productPrice?.toLocaleString()}</p>
                                                <p className="product-meta"><strong>Quantity:</strong> {quantity as number}</p>
                                                <div className="button-group">
                                                    <button className="qty-button" onClick={() => handleIncrease(item.id, productId)}>+</button>
                                                    <button className="qty-button" onClick={() => handleDecrease(item.id, productId)}>-</button>
                                                    <button className="delete-button" onClick={() => handleDelete(item.id, productId, item.productName || 'Product')}>delete</button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                                {/* <p><strong>Total Quantity:</strong> {item.totalQuantity}</p> */}
                                <p><strong>Total Price:</strong> ₹{item.totalPrice.toLocaleString()}</p>
                            </div>
                        ))}


                    </div>
                )}
            </main>
            {selectedItems.length > 0 && (
                <div className="fixed-summary">
                    <p><strong>Selected Total:</strong> ₹{selectedTotal.toLocaleString()}</p>
                </div>
            )}


            <style>{`
        .cart-page {
            font-family: 'Poppins', sans-serif;
            background: linear-gradient(to bottom right, #f0f4f8, #ffffff);
            min-height: 100vh;
            padding-bottom: 40px;
        }

        .cart-header {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            height: 60px;
            background: linear-gradient(to right, #1f4037, #99f2c8);
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 24px;
            color: white;
            z-index: 1000;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .product-info {
            display: flex;
            gap: 16px;
            align-items: flex-start;
            margin-bottom: 20px;
        }

        .product-image {
            width: 120px;
            height: auto;
            border-radius: 8px;
            object-fit: cover;
            flex-shrink: 0;
        }

        .product-details {
            flex: 1;
        }

        .back-button {
            background-color: white;
            color: #1f4037;
            border: none;
            padding: 8px 16px;
            border-radius: 6px;
            font-weight: 500;
            cursor: pointer;
            transition: background-color 0.3s ease;
        }

        .back-button:hover {
          background-color: #e0e0e0;
        }

        .cart-content {
            margin-top: 5px;
            padding: 20px;
        }

        // .product-image {
        //     width: 100%;
        //     max-width: 200px;
        //     height: auto;
        //     border-radius: 8px;
        //     margin-bottom: 10px;
        //     object-fit: cover;
        // }

        .top-toast {
            position: fixed;
            top: 70px;
            left: 50%;
            transform: translateX(-50%);
            background-color: #e6f4ea;
            color: #2e7d32;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
            display: flex;
            align-items: center;
            gap: 10px;
            z-index: 1100;
            font-weight: 500;
            border-left: 4px solid #2e7d32;
            animation: fadeOut 3s forwards;
        }

        .check-icon {
            font-weight: bold;
            font-size: 18px;
        }

        .close-toast {
            background: none;
            border: none;
            font-size: 16px;
            color: #2e7d32;
            cursor: pointer;
            margin-left: auto;
        }

        @keyframes fadeOut {
            0% { opacity: 1; }
            80% { opacity: 1; }
            100% { opacity: 0; }
        }

        .empty-message {
            text-align: center;
            font-size: 18px;
            color: #666;
        }

        .cart-list {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 20px;
        }

        .cart-card {
            background-color: white;
            padding: 20px;
            border-radius: 12px;
            border: 1px solid #e0e0e0;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
            transition: box-shadow 0.3s ease;
        }

        .cart-card:hover {
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .cart-card h3 {
            margin-bottom: 10px;
            color: #1f4037;
        }

        // .product-info {
        //   margin-bottom: 10px;
        // }

        .button-group {
            display: flex;
            gap: 8px;
            margin-top: 6px;
        }

        .qty-button, .delete-button {
            padding: 4px 8px;
            font-size: 14px;
            border-radius: 4px;
            min-width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
        }


        .qty-button {
            background-color: #d0f0fd
        }

        .delete-button {
            background-color: #ffebee;
            color: #c62828;
        }

        .delete-button:hover {
            background-color: #ffcdd2;
        }

        .product-checkbox {
            margin-right: 12px;
            margin-top: 6px;
        }

        .product-name {
            font-size: 18px;
            font-weight: 600;
            color:rgb(14, 100, 77);
            margin-bottom: 4px;
        }

        .product-desc {
            font-size: 14px;
            color: #555;
            margin-bottom: 6px;
        }

        .product-meta {
            font-size: 14px;
            color: #333;
            margin-bottom: 4px;
        }

        .fixed-summary {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: #ffffff;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            font-weight: 500;
            z-index: 1200;
        }

      `}</style>
        </div>
    );
};

export default CartDetails;
