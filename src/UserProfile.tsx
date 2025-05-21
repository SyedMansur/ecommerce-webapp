import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

const Profile = () => {
  const { id } = useParams();
  const [user, setUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get(`http://localhost:8000/user/${id}`, {
      headers: { Authorization: token || '' },
      withCredentials: true,
    })
      .then((res) => {
        setUser(res.data);
        setFormData(res.data);
      })
      .catch(() => console.error('Failed to fetch user profile...'));
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    const token = localStorage.getItem('token');
    axios.put(`http://localhost:8000/user`, formData, {
      headers: { Authorization: token || '' },
      withCredentials: true,
    })
      .then((res) => {
        setUser(res.data);
        setIsEditing(false);
        window.location.reload();

      })
      .catch(() => console.error('Failed to update user profile...'));
  };

  return (
    <div className="profile-container">
      <h2 className="profile-title">User Profile</h2>

      {!user ? (
        <p className="loading-text">Loading profile...</p>
      ) : (
        <div className="profile-card">
          {['firstName', 'lastName', /*{'emailId', 'userId',}*/ 'address'].map((field) => (
            <div key={field} className="profile-field">
              <label className="profile-label">
                {field
                    .replace(/([A-Z])/g, ' $1')   // Add space before capital letters
                    .replace(/^./, str => str.toUpperCase())}:
                </label>
              {isEditing ? (
                <input
                  type="text"
                  name={field}
                  value={formData[field] || ''}
                  onChange={handleChange}
                  className="profile-input"
                />
              ) : (
                <div className="profile-value">{user[field]}</div>
              )}
            </div>
          ))}

          {/* <div className="profile-type">
            <strong>User Type:</strong> {user.userType === 1 ? 'Admin' : 'User'}
          </div> */}

          <div className="profile-actions">
            {isEditing ? (
              <>
                <button className="btn btn-save" onClick={handleSave}>Save</button>
                <button className="btn btn-cancel" onClick={() => setIsEditing(false)}>Cancel</button>
              </>
            ) : (
              <button className="btn btn-edit" onClick={() => setIsEditing(true)}>Edit Profile</button>
            )}
          </div>
        </div>
      )}

      <style>{`
        .profile-container {
          max-width: 600px;
          margin: 40px auto;
          padding: 30px;
          background-color: #ffffff;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          font-family: 'Segoe UI', sans-serif;
        }

        .profile-title {
          text-align: center;
          margin-bottom: 30px;
          color: #333;
          font-size: 1.8rem;
        }

        .loading-text {
          text-align: center;
          color: #888;
        }

        .profile-card {
          border: 1px solid #ccc;
          border-radius: 8px;
          padding: 20px;
          background-color: #f9f9f9;
        }

        .profile-field {
          margin-bottom: 20px;
        }

        .profile-label {
        //   font-weight: 600;
        //   display: block;
        //   margin-bottom: 6px;
        //   color: #555;
        //   font-weight: 600rem;
        font-size: 1em;
          font-weight: 600;
          color: #333;
          margin: 4px 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .profile-input {
          width: 100%;
          padding: 10px;
          border-radius: 6px;
          border: 1px solid #ccc;
          font-size: 14px;
        }

        .profile-value {
          padding: 10px;
          background-color: #f5f5f5;
          border-radius: 6px;
          font-size: 14px;
        }

        // .profile-type {
        //   margin-top: 10px;
        //   font-size: 14px;
        //   color: #444;
        // }

        .profile-actions {
          text-align: center;
          margin-top: 30px;
        }

        .btn {
          padding: 10px 20px;
          margin: 0 10px;
          color: #fff;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
        }

        .btn-save {
          background-color: #28a745;
        }

        btn btn-save button:hover {
          background-color: #218739;
        }

        .btn-cancel {
          background-color: #6c757d;
        }

        .btn-edit {
          background-color: #007bff;
        }
      `}</style>
    </div>
  );
};

export default Profile;
