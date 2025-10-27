import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

const LIMIT = 12;

function Home() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loader = useRef(null);

  useEffect(() => {
    fetchProducts(page);
    // eslint-disable-next-line
  }, [page]);

  const fetchProducts = async (pageNum) => {
    setLoading(true);
    try {
      const res = await axios.get(`https://dummyjson.com/products?limit=${LIMIT}&skip=${(pageNum - 1) * LIMIT}`);
      if (res.data.products.length < LIMIT) setHasMore(false);
      setProducts((prev) => [...prev, ...res.data.products]);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        setPage((prev) => prev + 1);
      }
    });
    if (loader.current) observer.observe(loader.current);
    return () => observer.disconnect();
  }, [hasMore, loading]);

  return (
    <div className="container">
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4 product-grid mt-4">
        {products.map((product) => (
          <div className="col" key={product.id}>
            <ProductCard product={product} />
          </div>
        ))}
      </div>
      <div ref={loader} />
      {loading && <div className="alert alert-info">Loading...</div>}
    </div>
  );
}

export default Home;
