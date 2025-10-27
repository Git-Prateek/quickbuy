import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Profile() {
  const [user, setUser] = useState({ email: '', role: '', name: '' });
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ email: '', name: '', password: '' });
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Fetch user info (simulate with localStorage for demo)
      // In production, fetch from backend
      setUser(JSON.parse(localStorage.getItem('user')) || {});
      axios.get('/api/order', {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => setOrders(res.data.orders));
    }
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    // Implement user update API if needed
    setEditMode(false);
  };

  // Demo user info
  const demoUser = { email: 'user@example.com', role: 'buyer', name: 'John Doe', phone: '+1234567890', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' };

  return (
    <div className="container main-content" style={{ marginTop: '5.5rem' }}>
      <div className="profile-card">
        <img src={demoUser.avatar} alt="avatar" className="profile-avatar" />
        <div className="profile-details">
          <div><span className="icon">👤</span> <b>{demoUser.name}</b></div>
          <div><span className="icon">📧</span> {demoUser.email}</div>
          <div><span className="icon">📱</span> {demoUser.phone}</div>
          <div><span className="icon">🛒</span> Role: {demoUser.role}</div>
        </div>
        <button className="btn btn-green profile-edit-btn" onClick={() => setEditMode(true)}>Edit Profile</button>
        {editMode && (
          <div className="profile-edit">
            <input name="email" value={form.email} onChange={handleChange} placeholder="Email" />
            <input name="name" value={form.name} onChange={handleChange} placeholder="Name" />
            <input name="password" value={form.password} onChange={handleChange} placeholder="Password" type="password" />
            <button onClick={handleUpdate}>Save</button>
            <button onClick={() => setEditMode(false)}>Cancel</button>
          </div>
        )}
        <h3>Order History</h3>
        <ul>
          {orders.map(order => (
            <li key={order.orderId || order._id}>
              Order: {order.orderId || order._id} | Total: ${order.total}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Profile;
