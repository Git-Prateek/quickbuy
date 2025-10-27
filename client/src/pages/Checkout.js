import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';

const stripePromise = loadStripe('pk_test_your_public_key_here');

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    const card = elements.getElement(CardElement);
    const { paymentMethod, error: stripeError } = await stripe.createPaymentMethod({ type: 'card', card });
    if (stripeError) {
      setError(stripeError.message);
      setLoading(false);
      return;
    }
    const token = localStorage.getItem('token');
    try {
      // Fetch cart from backend
      const cartRes = await axios.get('/api/cart', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const cart = cartRes.data.cart;
      // Send paymentMethod.id, address, phone, cart to backend
      await axios.post('/api/order/checkout', {
        cart,
        address,
        phone,
        paymentMethodId: paymentMethod.id
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('Payment successful!');
    } catch (err) {
      setError(err.response?.data?.message || 'Payment failed');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={address} onChange={e => setAddress(e.target.value)} placeholder="Address" required />
      <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone" required />
      <CardElement />
      <button type="submit" disabled={loading}>Pay</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </form>
  );
}

function Checkout() {
  return (
    <Elements stripe={stripePromise}>
      <h2>Checkout</h2>
      <CheckoutForm />
    </Elements>
  );
}

export default Checkout;
