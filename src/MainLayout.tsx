import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { Outlet, useNavigate } from 'react-router-dom';
import axios from 'axios';
import * as FaIcons from 'react-icons/fa';

const MainLayout = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [hovered, setHovered] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleProfileClick = () => {
    if (user?.id) {
      navigate(`/profile/${user.id}`);
    }
  };

  const getInitial = (name: string) => {
    return name?.trim()?.charAt(0)?.toUpperCase() || '?';
  };

  const handleCartClick = async () => {
    try {
      const response = await axios.get(`http://localhost:8001/cart/${user.id}`);
      console.log('Cart Details:', response.data);
      navigate('/cart-details', { state: { cartData: response.data } });
    } catch (error) {
      console.error('Error fetching cart details:', error);
      alert('Failed to fetch cart details.');
    }
  };

  const CartIcon = FaIcons.FaShoppingCart as unknown as React.FC<React.SVGProps<SVGSVGElement>>;

  return (
    <div>
      <header style={styles.header}>
        <h1 style={styles.title}>E-Commerce Application</h1>

        <div
          style={styles.rightSection}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {user?.roleId === 1 && (
            <span onClick={handleCartClick} title="View Cart" style={{ cursor: 'pointer', marginRight: '16px' }}>
              <CartIcon style={{ fontSize: '20px' }} />
            </span>
          )}


          <div
            style={{
              ...styles.avatarContainer,
              transform: hovered ? 'rotateY(180deg)' : 'rotateY(0deg)',
            }}
          >
            <div style={{ ...styles.avatarFace, ...styles.front }} onClick={handleProfileClick}>
              {getInitial(user.fullName)}
            </div>
            <div style={{ ...styles.avatarFace, ...styles.back }} onClick={handleLogout}>
              🔓
            </div>
          </div>
        </div>
      </header>

      <div style={{ display: 'flex' }}>
        <Sidebar />
        <main style={styles.mainContent}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

const styles = {
  header: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    height: '60px',
    background: 'linear-gradient(to right, #1f4037, #99f2c8)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 24px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    zIndex: 1000,
    fontFamily: "'Poppins', 'Segoe UI', sans-serif",
    color: '#fff',
  },
  title: {
    fontSize: '26px',
    fontWeight: 600,
    color: '#ffffff',
  },
  rightSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    cursor: 'pointer',
  },
  avatarContainer: {
    width: '40px',
    height: '40px',
    perspective: '1000px',
    position: 'relative' as const,
    transformStyle: 'preserve-3d' as const,
    transition: 'transform 0.6s',
  },
  avatarFace: {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    backgroundColor: '#ffffff',
    color: '#1f4037',
    fontWeight: 'bold',
    fontSize: '1.2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute' as const,
    backfaceVisibility: 'hidden' as const,
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)',
  },
  front: {
    zIndex: 2,
  },
  back: {
    transform: 'rotateY(180deg)',
    backgroundColor: '#d9534f',
    color: '#fff',
  },
  mainContent: {
    marginLeft: '200px',
    marginTop: '60px',
    padding: '20px',
    width: '100%',
  },
};

export default MainLayout;
