import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const UpdateProductForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:8080/product/${id}`, {
          headers: {
            Authorization: token || '',
          },
        });

        if (response.ok) {
          const result = await response.json();
          const product = result;

          setFormData({
            productName: product.productName ?? '',
            productDesc: product.productDesc ?? '',
            productPrice: product.productPrice?.toString() ?? '',
            prodCat: product.prodCat ?? '',
            productQuantity: product.productQuantity?.toString() ?? '',
            uom: product.uom ?? '',
            prodRating: product.prodRating?.toString() ?? '',
            imageURL: product.imageURL ?? '',
          });
        } else {
          toast.error('Failed to load product');
        }
      } catch (error) {
        console.error('Error loading product:', error);
        toast.error('Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const confirmUpdate = window.confirm('Are you sure you want to update this product?');
    if (!confirmUpdate) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/product/${id}`, {
        method: 'PUT',
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
        toast.success('Product updated successfully!');
        navigate('/product/dashboard');
      } else {
        toast.error('Failed to update product');
      }
    } catch (error) {
      console.error('Update error:', error);
      toast.error('Something went wrong');
    }
  };

  if (loading) return <p>Loading product details...</p>;

  return (
    <div style={styles.container}>
      <h2>Update Product</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.field}>
          <label>Product Name</label>
          <input name="productName" value={formData.productName} onChange={handleChange} required style={styles.input} />
        </div>
        <div style={styles.field}>
          <label>Description</label>
          <input name="productDesc" value={formData.productDesc} onChange={handleChange} required style={styles.input} />
        </div>
        <div style={styles.field}>
          <label>Price</label>
          <input type="number" name="productPrice" value={formData.productPrice} onChange={handleChange} required style={styles.input} />
        </div>
        <div style={styles.field}>
          <label>Category</label>
          <input name="prodCat" value={formData.prodCat} onChange={handleChange} required style={styles.input} />
        </div>
        <div style={styles.field}>
          <label>Quantity</label>
          <input type="number" name="productQuantity" value={formData.productQuantity} onChange={handleChange} required style={styles.input} />
        </div>
        <div style={styles.field}>
          <label>Unit of Measure</label>
          <input name="uom" value={formData.uom} onChange={handleChange} required style={styles.input} />
        </div>
        <div style={styles.field}>
          <label>Rating</label>
          <input type="number" name="prodRating" value={formData.prodRating} onChange={handleChange} required style={styles.input} />
        </div>
        <div style={styles.field}>
          <label>Image URL</label>
          <input name="imageURL" value={formData.imageURL} onChange={handleChange} required style={styles.input} />
        </div>
        <button type="submit" style={styles.submitBtn}>Update</button>
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
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontWeight: 600,
    cursor: 'pointer',
  },
};

export default UpdateProductForm;
