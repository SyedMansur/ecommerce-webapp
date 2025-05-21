import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const CreateProductForm: React.FC = () => {

    const [formData, setFormData] = useState({
        productName: '',
        productDesc: '',
        productPrice: '',
        prodCat: '',
        productQuantity: '',
        uom: '',
        prodRating: '',
        imageURL: '',
    });

    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8080/product', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token || '',
                },
                body: JSON.stringify({
                    ...formData,
                    productPrice: parseFloat(formData.productPrice),
                    productQuantity: parseInt(formData.productQuantity),
                    prodRating: parseFloat(formData.prodRating),
                }),
            });

            if (response.ok) {
                toast.success('Product created successfully!');
                navigate('/product/Dashboard');
            } else {
                const error = await response.json();
                toast.error(error.message || 'Failed to create product');
            }
        } catch (error) {
            console.error('Create product error:', error);
            toast.error('Something went wrong');
        }
    };

    return (
        <div style={styles.container}>
            <h2>Create New Product</h2>
            <form onSubmit={handleSubmit} style={styles.form}>
                {[
                    { label: 'Product Name', name: 'productName' },
                    { label: 'Description', name: 'productDesc' },
                    { label: 'Price', name: 'productPrice', type: 'number' },
                    { label: 'Category', name: 'prodCat' },
                    { label: 'Quantity', name: 'productQuantity', type: 'number' },
                    { label: 'Unit of Measure (UOM)', name: 'uom' },
                    { label: 'Rating (out of 5)', name: 'prodRating', type: 'number' },
                    { label: 'Image URL', name: 'imageURL' },
                ].map(({ label, name, type = 'text' }) => (
                    <div key={name} style={styles.field}>
                        <label>{label}</label>
                        <input
                            type={type}
                            name={name}
                            value={(formData as any)[name]}
                            onChange={handleChange}
                            required
                            style={styles.input}
                        />
                    </div>
                ))}

                <button type="submit" style={styles.submitBtn}>Submit</button>
            </form>
        </div>
    );
};

const styles = {
    container: {
        padding: '20px',
        maxWidth: '600px',
        margin: '0 auto',
        fontFamily: "'Segoe UI', sans-serif",
    },
    form: {
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '16px',
    },
    field: {
        display: 'flex',
        flexDirection: 'column' as const,
    },
    input: {
        padding: '8px',
        borderRadius: '4px',
        border: '1px solid #ccc',
        fontSize: '16px',
    },
    submitBtn: {
        padding: '10px 16px',
        backgroundColor: '#2da44e',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        fontWeight: 600,
        cursor: 'pointer',
    },
};

export default CreateProductForm;
