import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function ProductCard({ product }) {
  const navigate = useNavigate();

  const handleAddToCart = (e) => {
    e.preventDefault();
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const exists = cart.find(item => item.id === product.id);
    if (exists) {
      exists.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('storage'));
  };

  const handleBuyNow = (e) => {
    e.preventDefault();
    handleAddToCart(e);
    navigate('/checkout');
  };

  return (
    <div className="card product-card">
      <img
        src={product.images[0] || product.thumbnail}
        alt={product.title}
        className="card-img-top"
        style={{
          width: '100%',
          height: '220px',
          objectFit: 'contain',
          objectPosition: 'center',
          background: '#f3f3f3',
          aspectRatio: '4/3',
          display: 'block',
        }}
      />
      <div className="card-body">
        <div className="category-tag">{product.category}</div>
        <h5 className="card-title">{product.title}</h5>
        <div className="star-rating">
          <span role="img" aria-label="star">⭐</span> {product.rating}
        </div>
        <p className="card-text price">${product.price}</p>
        <div className="d-flex flex-row gap-2 mt-2 justify-content-center align-items-center flex-wrap">
          <button
            className="btn btn-green d-flex align-items-center justify-content-center product-action-btn"
            onClick={handleAddToCart}
            title="Add to Cart"
            style={{ minWidth: 110, minHeight: 44 }}
          >
            Add to Cart
          </button>
          <button
            className="btn btn-green product-action-btn"
            onClick={handleBuyNow}
            style={{ minWidth: 100, minHeight: 44 }}
          >
            Buy Now
          </button>
          <Link
            className="btn btn-green product-action-btn"
            to={`/product/${product.id}`}
            style={{ minWidth: 110, minHeight: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            title="View Product"
          >
            View Product
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
