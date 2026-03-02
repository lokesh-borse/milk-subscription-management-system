import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const Landing = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    let mounted = true;
    api.get('/product/product/').then((res) => {
      if (mounted) setProducts(res.data?.slice(0, 4) || []);
    }).catch(() => {});
    return () => { mounted = false; };
  }, []);

  return (
    <>
      <section className="hero-fullscreen">
        <picture>
          <source type="image/webp" srcSet="https://images.pexels.com/photos/1276238/pexels-photo-1276238.jpeg?auto=compress&cs=tinysrgb&w=2500&fm=webp" />
          <img
            src="https://images.pexels.com/photos/1276238/pexels-photo-1276238.jpeg?auto=compress&cs=tinysrgb&w=2500"
            alt="Fresh Morning Farm"
            className="hero-bg"
          />
        </picture>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="fade-up">Dairy, Reimagined.</h1>
          <p className="fade-up delay-1">Ethically sourced, estate-bottled, and delivered to your doorstep before dawn. Experience the pure essence of the pasture.</p>
          <div className="hero-actions fade-up delay-2">
            <Link to="/signup" className="btn btn-large btn-accent">Start Your Subscription</Link>
            <Link to="/products" className="btn btn-outline-light btn-large">Explore Collection</Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container grid cols-2 align-center gap-lg">
          <div className="image-stack">
            <img loading="lazy" src="https://images.pexels.com/photos/11556841/pexels-photo-11556841.jpeg?auto=compress&cs=tinysrgb&w=1200" alt="Our Herd" className="img-main" />
            <img loading="lazy" src="https://images.pexels.com/photos/6803747/pexels-photo-6803747.jpeg?auto=compress&cs=tinysrgb&w=800" alt="Fresh Milk" className="img-sub" />
          </div>
          <div>
            <h4 className="overline">Our Heritage</h4>
            <h2 className="title">Pasture-First Philosophy.</h2>
            <p className="subtitle" style={{ marginTop: 14 }}>We believe that the finest dairy begins with the well-being of the herd. Our cows graze on nutrient-rich, pesticide-free pastures, producing milk that is as nature intended: pure, creamy, and wholesome.</p>
            <Link to="/products" className="link-arrow" style={{ marginTop: 22 }}>Learn About Our Process &rarr;</Link>
          </div>
        </div>
      </section>

      <section className="section bg-surface">
        <div className="container">
          <div className="section-header text-center">
            <h4 className="overline">The Journey</h4>
            <h2 className="title">From Pasture to Pour.</h2>
            <p className="subtitle" style={{ margin: '10px auto 0', maxWidth: 680 }}>A seamless cycle of care, quality, and freshness.</p>
          </div>
          <div className="process-grid">
            <div className="process-step">
              <div className="process-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
              </div>
              <h3>Ethical Sourcing</h3>
              <p>We partner with local family farms that prioritize animal welfare and regenerative practices.</p>
            </div>
            <div className="process-step">
              <div className="process-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 6v6l4 2"></path></svg>
              </div>
              <h3>Pristine Processing</h3>
              <p>State-of-the-art, small-batch bottling ensures maximum freshness and nutrient retention.</p>
            </div>
            <div className="process-step">
              <div className="process-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
              </div>
              <h3>Sunrise Delivery</h3>
              <p>Your delivery arrives in chilled, reusable glass bottles before you even wake up.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header text-center">
            <h4 className="overline">Our Collections</h4>
            <h2 className="title">Curated Dairy Excellence.</h2>
          </div>
          <div className="grid cols-3 gap-md">
            {[
              { title: 'Pure Milk', img: 'https://images.pexels.com/photos/5990705/pexels-photo-5990705.jpeg?auto=compress&cs=tinysrgb&w=800' },
              { title: 'Artisan Cheeses', img: 'https://images.pexels.com/photos/10585061/pexels-photo-10585061.jpeg?auto=compress&cs=tinysrgb&w=800' },
              { title: 'Cultured Yogurt', img: 'https://images.pexels.com/photos/4006347/pexels-photo-4006347.jpeg?auto=compress&cs=tinysrgb&w=800' }
            ].map((cat) => (
              <div key={cat.title} className="category-visual-card">
                <img loading="lazy" src={cat.img} alt={cat.title} />
                <div className="cat-overlay">
                  <h3>{cat.title}</h3>
                  <Link to="/products" className="btn btn-sm btn-outline-light">Shop Collection</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-surface">
        <div className="container">
          <div className="section-header split">
            <div>
              <h4 className="overline">Fresh Arrivals</h4>
              <h2 className="title">Morning Staples</h2>
            </div>
            <Link to="/products" className="link-arrow">View All Collection &rarr;</Link>
          </div>
          <div className="grid cols-4 gap-md">
            {products.map((p) => (
              <Link to={`/product/${p.id}`} key={p.id} className="product-card">
                <div className="product-img-wrapper">
                  <img loading="lazy" src={`https://images.pexels.com/photos/248412/pexels-photo-248412.jpeg?auto=compress&cs=tinysrgb&w=600&sig=${p.id}`} alt={p.name} className="product-img" />
                </div>
                <div className="product-info">
                  <h3 className="product-name">{p.name}</h3>
                  <div className="product-meta" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="price">${p.price}</span>
                    <span className="btn-text" style={{ color: 'var(--color-brand-600)' }}>Subscribe &rarr;</span>
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
