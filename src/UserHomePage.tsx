import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
  createDate: Date;
  modifyDate: Date;
}

interface ApiResponse {
  data: Product[];
  message: string;
}

interface DropdownStyle extends React.CSSProperties {
  appearance?: 'none';
  WebkitAppearance?: 'none';
  MozAppearance?: 'none';
}

const fetchProducts = async (): Promise<ApiResponse> => {
  const response = await axios.get<ApiResponse>('http://localhost:8080/product');
  return response.data;
};

const UserHomePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [message, setMessage] = useState<string>('');
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userId = user?.id;

  useEffect(() => {
    const getProducts = async () => {
      try {
        const apiResponse = await fetchProducts();
        setProducts(apiResponse.data);
        setMessage(apiResponse.message);
        const initialQuantities = apiResponse.data.reduce((acc, product) => {
          acc[product.id] = 0;
          return acc;
        }, {} as { [key: number]: number });
        setQuantities(initialQuantities);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    getProducts();
  }, []);

  const categories = ['All', ...Array.from(new Set(products.map(p => p.prodCat)))];

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.productName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.prodCat === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddToCart = async (product: Product) => {
    const quantity = quantities[product.id];
    if (quantity > 0 && userId) {
      try {
        const payload = {
          userId,
          productQty: {
            [product.id]: quantity,
          },
        };

        const response = await axios.post('http://localhost:8001/cart', payload);

        if (response.status === 200) {
          toast.success(`${product.productName} added to cart successfully!`, {
            position: 'top-right',
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
          });
        } else {
          toast.error('Failed to add product to cart.');
        }
      } catch (error) {
        console.error('Error adding to cart:', error);
        toast.error('Something went wrong while adding to cart.');
      }
    } else {
      toast.warn('Please select a quantity greater than 0.');
    }
  };

  const handleQuantityChange = (productId: number, amount: number) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: Math.max(prevQuantities[productId] + amount, 0),
    }));
  };

  return (
    <div style={styles.container}>
      <ToastContainer />
      <div style={styles.searchRow}>
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchBar}
        />

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={styles.dropdown as any}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div style={styles.productGrid}>
        {filteredProducts.map((product) => (
          <div key={product.id} style={styles.card}>
            {product.imageURL && (
              <img
                src={product.imageURL}
                alt={product.productName}
                style={styles.productImage}
              />
            )}
            <h3 style={styles.productTitle}>{product.productName}</h3>
            <p style={styles.productCategory}>{product.prodCat}</p>
            <p style={styles.productPrice}>Price: ₹{product.productPrice}</p>
            <p style={styles.rating}>
              Rating: {'★'.repeat(product.prodRating)}{'☆'.repeat(5 - product.prodRating)}
            </p>

            <div style={styles.quantityControls}>
              <button style={styles.button} onClick={() => handleQuantityChange(product.id, -1)}>-</button>
              <span>{quantities[product.id]}</span>
              <button style={styles.button} onClick={() => handleQuantityChange(product.id, 1)}>+</button>
            </div>

            <button style={{ ...styles.button, marginTop: '10px' }} onClick={() => handleAddToCart(product)}>
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: "'Poppins', 'Segoe UI', sans-serif",
    padding: '20px',
    backgroundColor: '#f4f7f9',
    minHeight: '100vh',
  },
  searchRow: {
    display: 'flex',
    gap: '12px',
    marginBottom: '20px',
    flexWrap: 'wrap' as const,
  },
  searchBar: {
    padding: '10px 16px',
    width: '100%',
    maxWidth: '400px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '16px',
  },
  dropdown: {
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '14px',
    backgroundColor: '#fff',
    fontFamily: "'Segoe UI', sans-serif",
    appearance: 'none',
    WebkitAppearance: 'none',
    MozAppearance: 'none',
    backgroundImage: 'url("data:image/svg+xml;utf8,<svg fill=\'%23000\' height=\'24\' viewBox=\'0 0 24 24\' width=\'24\' xmlns=\'http://www.w3.org/2000/svg\'><path d=\'M7 10l5 5 5-5z\'/></svg>")',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 10px center',
    backgroundSize: '16px',
    paddingRight: '30px',
  },
  productGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '20px',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
    padding: '16px',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  },
  productImage: {
    width: '100%',
    height: '160px',
    objectFit: 'cover' as const,
    borderRadius: '8px',
    marginBottom: '12px',
  },
  productTitle: {
    fontSize: '18px',
    fontWeight: 600,
    color: '#1f2937',
    marginBottom: '8px',
  },
  productCategory: {
    fontSize: '14px',
    color: '#6b7280',
    marginBottom: '4px',
  },
  productPrice: {
    fontSize: '16px',
    fontWeight: 500,
    color: '#007185',
    marginBottom: '8px',
  },
  rating: {
    color: '#f59e0b',
    fontSize: '14px',
  },
  quantityControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginTop: '10px',
  },
  button: {
    padding: '6px 12px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: '#007185',
    color: '#fff',
    cursor: 'pointer',
    fontWeight: 500,

  },
};

export default UserHomePage;
