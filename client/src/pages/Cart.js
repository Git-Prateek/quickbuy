import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Cart() {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(storedCart);
    function syncCart() {
      setCart(JSON.parse(localStorage.getItem('cart')) || []);
    }
    window.addEventListener('storage', syncCart);
    return () => window.removeEventListener('storage', syncCart);
  }, []);

  const removeItem = (id) => {
    const updatedCart = cart.filter(item => item.id !== id);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('storage'));
  };

  const updateQuantity = (id, qty) => {
    const updatedCart = cart.map(item => item.id === id ? { ...item, quantity: qty } : item);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('storage'));
  };

  const total = cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);

  return (
    <div className="container mt-4">
      <h2>Shopping Cart</h2>
      {cart.length === 0 ? <div className="alert alert-warning">Cart is empty</div> : (
        <table className="cart-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Remove</th>
            </tr>
          </thead>
          <tbody>
            {cart.map(item => (
              <tr key={item.id}>
                <td>
                  <img src={item.images[0] || item.thumbnail} alt={item.title} />
                  <span style={{ marginLeft: 10 }}>{item.title}</span>
                </td>
                <td className="cart-price">${item.price}</td>
                <td>
                  <input type="number" value={item.quantity || 1} min={1} style={{ width: 60 }} onChange={e => updateQuantity(item.id, Number(e.target.value))} />
                </td>
                <td>
                  <button className="btn btn-green" onClick={() => removeItem(item.id)}>Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="cart-total">Total: ${total.toFixed(2)}</div>
      <button className="btn btn-green mt-3" onClick={() => navigate('/checkout')} disabled={cart.length === 0}>Proceed to Checkout</button>
    </div>
  );
}

export default Cart;
