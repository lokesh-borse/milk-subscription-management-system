import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const featureItems = [
  {
    title: 'Pre-Dawn Delivery',
    desc: 'While you are sleeping, our route team delivers before sunrise.',
    img: 'https://images.pexels.com/photos/28424335/pexels-photo-28424335.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    title: 'Glass-Bottled Purity',
    desc: 'Returnable glass keeps flavor natural and supports a cleaner planet.',
    img: 'https://images.pexels.com/photos/35190167/pexels-photo-35190167.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    title: 'Happy Pastures',
    desc: 'Our cows graze freely on open fields for richer, cleaner milk.',
    img: 'https://images.pexels.com/photos/5409664/pexels-photo-5409664.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
];

const workflowItems = [
  {
    step: '01',
    title: 'Farm Pickup Before Dawn',
    text: 'Milk is collected from verified local farms every morning before processing begins.',
  },
  {
    step: '02',
    title: 'Quality Check and Chilling',
    text: 'Each batch is tested, filtered, and chilled to maintain freshness and taste.',
  },
  {
    step: '03',
    title: 'Route-Based Delivery',
    text: 'Subscriptions are delivered by slot and address, tracked through your dashboard.',
  },
];

const heroStats = [
  { value: '5AM', label: 'Earliest delivery' },
  { value: '100%', label: 'Freshness checked' },
];

const Landing = () => {
  const [products, setProducts] = useState([]);
  const { isAuthenticated } = useAuth();

  const subscriptionStartPath = isAuthenticated ? '/subscribe/category' : '/signup';

  useEffect(() => {
    let mounted = true;
    api.get('/product/product/')
      .then((res) => {
        if (mounted) {
          setProducts(res.data?.slice(0, 4) || []);
        }
      })
      .catch(() => { });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="landing-premium">
      <section className="lp-hero section">
        <div className="container">
          <div className="lp-hero-stage fade-up">
            <img
              src="https://images.pexels.com/photos/422218/pexels-photo-422218.jpeg?auto=compress&cs=tinysrgb&w=1800"
              alt="Dairy farm morning landscape"
            />
            <div className="lp-hero-overlay">
              <div className="lp-hero-copy">
                <p className="lp-chip">Fresh from our estate to your doorstep</p>
                <h1 className="lp-title">Taste the <span>Morning.</span></h1>
                <p className="lp-subtitle">
                  Heritage-bred cows, artisanal dairy craftsmanship, and reliable delivery before 7 AM.
                </p>
                <div className="hero-cta-section">
                  <div className="hero-actions">
                    <Link to={subscriptionStartPath} className="btn btn-large btn-accent">Start Subscription</Link>
                    <Link to="/products" className="btn btn-large btn-outline-light">View Our Dairy</Link>
                  </div>
                  <div className="lp-stat-strip">
                    {heroStats.map((item) => (
                      <div key={item.label} className="lp-stat-item">
                        <strong>{item.value}</strong>
                        <span>{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header text-center">
            <h4 className="overline">Why Milkman</h4>
            <h2 className="title">Crafted for Better Mornings.</h2>
          </div>
          <div className="lp-feature-grid">
            {featureItems.map((item) => (
              <article key={item.title} className="lp-feature-card">
                <img src={item.img} alt={item.title} loading="lazy" />
                <div className="lp-feature-body">
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section lp-collection-band">
        <div className="container lp-collection-grid">
          <div className="lp-collection-image">
            <img
              src="https://images.pexels.com/photos/35190167/pexels-photo-35190167.jpeg?auto=compress&cs=tinysrgb&w=1400"
              alt="Artisanal products"
              loading="lazy"
            />
          </div>
          <div>
            <h4 className="overline">More Than Milk</h4>
            <h2 className="title">Curated Dairy Collections.</h2>
            <p className="subtitle" style={{ marginTop: 16 }}>
              Explore our selection of artisanal cheeses, cultured yogurt, and hand-churned butter.
            </p>
            <Link to="/categories" className="btn" style={{ marginTop: 20 }}>Explore Collections</Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header text-center">
            <h4 className="overline">How It Works</h4>
            <h2 className="title">Milkman Delivery Workflow</h2>
          </div>
          <div className="lp-work-grid">
            {workflowItems.map((item) => (
              <article key={item.step} className="lp-work-card">
                <span className="lp-work-step">{item.step}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <Link to={subscriptionStartPath} className="btn btn-accent">Start My Subscription</Link>
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
                  <img
                    loading="lazy"
                    src={p.image || `https://images.pexels.com/photos/248412/pexels-photo-248412.jpeg?auto=compress&cs=tinysrgb&w=600&sig=${p.id}`}
                    alt={p.name}
                    className="product-img"
                    onError={(e) => { e.target.src = 'https://images.pexels.com/photos/248412/pexels-photo-248412.jpeg?auto=compress&cs=tinysrgb&w=600'; }}
                  />
                </div>
                <div className="product-info">
                  <h3 className="product-name">{p.name}</h3>
                  <div className="product-meta" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="price">₹{p.price}</span>
                    <span className="btn-text" style={{ color: 'var(--color-brand-600)' }}>Subscribe &rarr;</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
