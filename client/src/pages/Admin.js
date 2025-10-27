import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Admin() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: '', description: '', price: '', category: '', images: [''] });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get('/api/products', {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => setProducts(res.data.products));
      axios.get('/api/order', {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => setOrders(res.data.orders));
    }
    setLoading(false);
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = async () => {
    const token = localStorage.getItem('token');
    await axios.post('/api/products', form, {
      headers: { Authorization: `Bearer ${token}` }
    });
    window.location.reload();
  };

  const handleEdit = async () => {
    const token = localStorage.getItem('token');
    await axios.put(`/api/products/${editId}`, form, {
      headers: { Authorization: `Bearer ${token}` }
    });
    window.location.reload();
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    await axios.delete(`/api/products/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    window.location.reload();
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container main-content" style={{ marginTop: '5.5rem' }}>
      <div className="admin-section">
        <h2>Seller Admin Panel</h2>
        <div className="mb-4">
          <h3>{editId ? 'Edit Product' : 'Add Product'}</h3>
          <input name="title" value={form.title} onChange={handleChange} placeholder="Title" className="form-control mb-2" />
          <input name="description" value={form.description} onChange={handleChange} placeholder="Description" className="form-control mb-2" />
          <input name="price" value={form.price} onChange={handleChange} placeholder="Price" type="number" className="form-control mb-2" />
          <input name="category" value={form.category} onChange={handleChange} placeholder="Category" className="form-control mb-2" />
          <input name="images" value={form.images[0]} onChange={e => setForm({ ...form, images: [e.target.value] })} placeholder="Image URL" className="form-control mb-2" />
          <button className="btn btn-green me-2" onClick={editId ? handleEdit : handleAdd}>{editId ? 'Update' : 'Add'}</button>
          {editId && <button className="btn btn-secondary" onClick={() => { setEditId(null); setForm({ title: '', description: '', price: '', category: '', images: [''] }); }}>Cancel</button>}
        </div>
        <h3>Products</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Price</th>
              <th>Category</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product._id}>
                <td>{product.title}</td>
                <td>${product.price}</td>
                <td>{product.category}</td>
                <td>
                  <button className="btn btn-green btn-sm me-2" onClick={() => { setEditId(product._id); setForm(product); }}>Edit</button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(product._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <h3>Order History</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.orderId || order._id}>
                <td>{order.orderId || order._id}</td>
                <td>${order.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Admin;
