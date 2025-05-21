import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

interface Product {
  id: number;
  productName: string;
  productDesc: string;
  productPrice: number;
  totProdPrice: number;
  prodCat: string;
  productQuantity: number;
  uom: string;
  prodRating: number;
  imageURL: string;
  createDate: string;
  modifyDate: string | null;
}

const ProductDashboard: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/product', {
        headers: {
          Authorization: token || '',
        },
      });

      if (response.ok) {
        const result = await response.json();
        setProducts(result.data);
      } else {
        toast.error('Failed to fetch products');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Something went wrong');
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleCreate = () => {
    navigate('/create-product');
  };

  const handleUpdate = (id: number) => {
    navigate(`/update-product/${id}`);
  };

  const handleDelete = async (id: number) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/product/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: token || '',
        },
      });

      if (response.ok) {
        toast.success('Product deleted');
        fetchProducts();
      } else {
        toast.error('Failed to delete product');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Something went wrong');
    }
  };

  return (
    <div style={styles.dashboard}>
      <div style={styles.header}>
        <h2 style={styles.title}>Product Dashboard</h2>
        <button style={styles.createBtn} onClick={handleCreate}>Add Product</button>
      </div>

      <div style={styles.grid}>
        {products.map(product => (
          <div key={product.id} style={styles.card}>
            <img src={product.imageURL} alt={product.productName} style={styles.image} />
            <h3 style={styles.productName}>{product.productName}</h3>
            <p style={styles.productDesc}>{product.productDesc}</p>
            <p style={styles.productName1}><strong>Price:</strong> ₹{product.productPrice}</p>
            <p style={styles.productName1}><strong>Quantity:</strong> {product.productQuantity}</p>
            <div style={styles.actions}>
              <button style={styles.updateBtn} onClick={() => handleUpdate(product.id)}>Update</button>
              <button style={styles.deleteBtn} onClick={() => handleDelete(product.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  dashboard: {
    padding: '20px',
    fontFamily: "'Segoe UI', sans-serif",
    backgroundColor: '#f5f5f5',
    minHeight: '100vh',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
    padding: '0 10px',
    backgroundColor: '#f5f5f5',
  },
  grid: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '16px',
    justifyContent: 'flex-start',
  },
  card: {
    background: '#fff',
    minHeight: '360px',
    border: '1px solid #e1e4e8',
    borderRadius: '8px',
    width: '200px',
    padding: '12px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
    display: 'flex',
    flexDirection: 'column' as const,
    // alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '140px',
    objectFit: 'cover' as const,
    borderRadius: '6px',
    marginBottom: '8px',
  },
  productName: {
    fontSize: '16px',
    fontWeight: 600,
    margin: '6px 0 4px',
    textAlign: 'center' as const,
  },
  productName1: {
    fontSize: '16px',
    fontWeight: 350,
    margin: '6px 0 4px',
    textAlign: 'left' as const,
    // color: 'rgb(34, 94, 78)',
    color: '#225e4e',
  },
  productDesc: {
    fontSize: '14px',
    color: '#555',
    marginBottom: '8px',
    textAlign: 'center' as const,
  },
  actions: {
  display: 'flex',
  justifyContent: 'center',
  gap: '10px',
  marginTop: '12px',
  width: '100%',
},

updateBtn: {
  flex: 1,
  padding: '6px 0',
  border: 'none',
  borderRadius: '4px',
  fontWeight: 500,
  backgroundColor: '#2563eb',
  color: 'white',
  cursor: 'pointer',
  fontSize: '13px',
  transition: 'background 0.3s',
  textAlign: 'center' as const,
},

deleteBtn: {
  flex: 1,
  padding: '6px 0',
  border: 'none',
  borderRadius: '4px',
  fontWeight: 500,
  backgroundColor: '#ef4444',
  color: 'white',
  cursor: 'pointer',
  fontSize: '13px',
  transition: 'background 0.3s',
  textAlign: 'center' as const,
},
  createBtn: {
    backgroundColor: '#2da44e',
    color: 'white',
    padding: '8px 14px',
    border: 'none',
    borderRadius: '6px',
    fontWeight: 600,
    fontSize: '14px',
    cursor: 'pointer',
  },
  title: {
    fontSize: '24px',
    fontWeight: 600,
    margin: 0,
  },
};

export default ProductDashboard;
