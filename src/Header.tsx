import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleProfileClick = () => {
    if (user?.id) {
      navigate(`/profile/${user.id}`);
    }
  };

  return (
    <header className="header">
      <div className="header-left">
        <h2 className="app-title">Welcome, {user.fullName} 👋</h2>
      </div>
      <div className="header-right" onClick={handleProfileClick} title="View Profile">
        <span className="avatar">👤</span>
      </div>

      <style>{`
        .header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #007185;
  color: white;
  margin-left: 200px; /* Push right of sidebar */
  margin-top: 60px;   /* Push below fixed main header */
  height: 60px;
  position: relative;
  z-index: 900;
}


        .app-title {
          font-size: 1.2rem;
          margin: 0;
        }

        .header-right {
          cursor: pointer;
        }

        .avatar {
          font-size: 1.5rem;
          background-color: #fff;
          color:rgb(0, 133, 71);
          border-radius: 50%;
          padding: 6px 10px;
          font-weight: bold;
        }

        .avatar:hover {
          background-color: #f0f0f0;
        }
      `}</style>
    </header>
  );
};

export default Header;