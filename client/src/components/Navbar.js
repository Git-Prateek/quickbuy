import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const location = useLocation();
  const [cartCount, setCartCount] = React.useState(0);

  React.useEffect(() => {
    function updateCartCount() {
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      setCartCount(cart.length);
    }
    updateCartCount();
    const interval = setInterval(updateCartCount, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <nav className="navbar navbar-expand-lg fixed-top shadow-sm" style={{ zIndex: 1050 }}>
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">QuickBuy</Link>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className={`nav-link${location.pathname === '/' ? ' active' : ''}`} to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link${location.pathname === '/cart' ? ' active' : ''}`} to="/cart">
                <span role="img" aria-label="cart">🛒</span> ({cartCount})
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link${location.pathname === '/profile' ? ' active' : ''}`} to="/profile">Profile</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link${location.pathname === '/admin' ? ' active' : ''}`} to="/admin">Admin</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
