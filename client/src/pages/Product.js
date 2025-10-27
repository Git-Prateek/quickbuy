import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Product() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get(`https://dummyjson.com/products/${id}`).then(res => setProduct(res.data)).catch(console.error);
  }, [id]);

  const handleAddToCart = async () => {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const exists = cart.find(item => item.id === product.id);
    if (exists) {
      exists.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    setMessage('Added to cart!');
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/checkout');
  };

  if (!product) return <div className="container"><div className="alert alert-info">Loading...</div></div>;

  return (
    <div className="container mt-4">
      <div className="card mb-4">
        <div className="row g-0">
          <div className="col-md-5">
            <img src={product.images[0] || product.thumbnail} alt={product.title} className="img-fluid rounded-start" style={{ maxHeight: '350px', objectFit: 'cover' }} />
          </div>
          <div className="col-md-7">
            <div className="card-body">
              <h2 className="card-title">{product.title}</h2>
              <span className="badge bg-primary me-2">{product.category}</span>
              <span className="badge bg-warning text-dark">⭐ {product.rating}</span>
              <p className="card-text mt-2">{product.description}</p>
              <h4 className="card-text text-success">${product.price}</h4>
              <div className="d-flex gap-2 mt-3">
                <button className="btn btn-green" onClick={handleAddToCart}>Add to Cart</button>
                <button className="btn btn-green" onClick={handleBuyNow}>Buy Now</button>
              </div>
              {message && <div className="alert alert-success mt-3">{message}</div>}
            </div>
          </div>
        </div>
      </div>
      {/* Reviews and other details can go here */}
    </div>
  );
}

export default Product;
