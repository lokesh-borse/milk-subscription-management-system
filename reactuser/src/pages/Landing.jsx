import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const Landing = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    let mounted = true;
    api.get('/product/product/').then(res => {
      if (mounted) setProducts(res.data?.slice(0, 4) || []);
    }).catch(() => {});
    return () => { mounted = false; };
  }, []);

  return (
    <>
      {/* Massive Immersive Hero */}
      <section className="hero-fullscreen">
        <picture>
          <source type="image/webp" srcSet="https://images.unsplash.com/photo-1528750997573-59b89d56f4f7?q=80&w=2500&auto=format&fit=crop&fm=webp" />
          <img
            src="https://images.unsplash.com/photo-1528750997573-59b89d56f4f7?q=80&w=2500&auto=format&fit=crop"
            alt="Fresh Milk"
            className="hero-bg"
            loading="lazy"
          />
        </picture>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="fade-up">Farm to Fridge, Flawlessly.</h1>
          <p className="fade-up delay-1">Uncompromising quality. Organic, grass-fed dairy tailored to your schedule.</p>
          <div className="hero-actions fade-up delay-2">
            <Link to="/signup" className="btn btn-large">Curate Your Delivery</Link>
            <Link to="/products" className="btn btn-outline-light btn-large">Explore Dairy</Link>
          </div>
        </div>
      </section>

      {/* The Story / Image Split */}
      <section className="section story-section">
        <div className="container grid cols-2 align-center gap-lg">
          <div className="image-stack">
            <img src="https://images.unsplash.com/photo-1500595046743-cd271d694d30?q=80&w=1000&auto=format&fit=crop" alt="Farm" className="img-main shadow-lg" />
            <img src="https://images.unsplash.com/photo-1596328546171-77e37b5e8b3d?q=80&w=600&auto=format&fit=crop" alt="Cows" className="img-sub shadow-lg" />
          </div>
          <div className="text-content">
            <h4 className="overline">Our Heritage</h4>
            <h2 className="title">Rooted in Pasture.</h2>
            <p className="subtitle">We believe that the best milk comes from happy, pastured cows. Partnering directly with ethical family farms, we ensure every bottle is free from artificial hormones and rich in natural nutrients.</p>
            <Link to="/about" className="link-arrow">Read Our Story &rarr;</Link>
          </div>
        </div>
      </section>

      {/* Visual Categories List */}
      <section className="section bg-surface">
        <div className="container">
          <div className="section-header text-center">
            <h4 className="overline">Curated Collections</h4>
            <h2 className="title">Dairy, Elevated.</h2>
          </div>
          <div className="grid cols-3 gap-md">
            {[
              { title: "Raw Milk", img: "https://images.unsplash.com/photo-1550583724-b2692b85b150?q=80&w=800&auto=format&fit=crop" },
              { title: "Artisan Cheeses", img: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?q=80&w=800&auto=format&fit=crop" },
              { title: "Cultured Yogurt", img: "https://images.unsplash.com/photo-1588714477688-cf1407e38db0?q=80&w=800&auto=format&fit=crop" }
            ].map((cat, i) => (
              <div key={i} className="category-visual-card">
                <img src={cat.img} alt={cat.title} />
                <div className="cat-overlay">
                  <h3>{cat.title}</h3>
                  <Link to={`/products`} className="btn btn-sm btn-outline-light">Shop Collection</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Grid */}
      <section className="section">
        <div className="container">
          <div className="section-header split">
            <h2 className="title">Morning Staples</h2>
            <Link to="/products" className="link-arrow">View All &rarr;</Link>
          </div>
          <div className="grid cols-4 gap-sm">
            {products.map((p, i) => (
              <Link to={`/product/${p.id}`} key={p.id} className="product-card">
                <div className="product-img-wrapper">
                  <img src={`https://images.unsplash.com/photo-1563636619-e9143da7973b?q=80&w=600&auto=format&fit=crop&sig=${i}`} alt={p.name} className="product-img" />
                </div>
                <div className="product-info">
                  <h3 className="product-name">{p.name}</h3>
                  <div className="product-meta">
                    <span className="price">${p.price}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Landing;