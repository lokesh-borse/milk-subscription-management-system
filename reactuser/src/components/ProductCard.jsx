import React, { useState, useMemo } from 'react';
import { Heart, Star, ShoppingCart } from 'lucide-react';
import './ProductCard.css';
import { formatINR } from '../utils/currency';

/**
 * ProductCard Component
 * Enhanced product display with interactive features
 * Features:
 * - Image with hover zoom effect
 * - Product badge (Popular, New)
 * - Favorite/Wishlist toggle
 * - Star rating display
 * - Hover overlay with action buttons
 * - Category badge with color
 * - Review count display
 * - Professional styling
 */
const ProductCard = ({
  id,
  name,
  price,
  image,
  category,
  rating,
  reviewCount,
  badge,
  isFavorite,
  onFavoriteToggle,
  onViewDetails,
  onAddToCart,
  isLoading,
}) => {
  const [isFaved, setIsFaved] = useState(isFavorite || false);
  const [isHovered, setIsHovered] = useState(false);

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFaved(!isFaved);
    if (onFavoriteToggle) onFavoriteToggle(id, !isFaved);
  };

  const handleViewDetails = (e) => {
    e.preventDefault();
    if (onViewDetails) onViewDetails(id);
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAddToCart) onAddToCart(id);
  };

  const categoryColors = {
    milk: '#3b82f6',
    yogurt: '#f59e0b',
    cheese: '#ef4444',
    butter: '#8b5cf6',
    cream: '#10b981',
  };

  const categoryColor = useMemo(() => {
    const cat = category?.toLowerCase() || 'milk';
    return categoryColors[cat] || '#3b82f6';
  }, [category]);

  if (isLoading) {
    return (
      <div className="product-card-skeleton">
        <div className="skeleton-image"></div>
        <div className="skeleton-title"></div>
        <div className="skeleton-price"></div>
      </div>
    );
  }

  return (
    <div
      className="product-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="product-image-container">
        <img
          src={image || 'https://via.placeholder.com/200?text=Product'}
          alt={name}
          className="product-image"
          onError={(e) => {
            e.currentTarget.src = 'https://images.pexels.com/photos/248412/pexels-photo-248412.jpeg?auto=compress&cs=tinysrgb&w=900';
          }}
        />

        {/* Badge */}
        {badge && (
          <div className={`product-badge badge-${badge.toLowerCase()}`}>
            {badge}
          </div>
        )}

        {/* Favorite Button */}
        <button
          className={`favorite-btn ${isFaved ? 'favorited' : ''}`}
          onClick={handleFavoriteClick}
          title={isFaved ? 'Remove from favorites' : 'Add to favorites'}
          aria-label="Toggle favorite"
        >
          <Heart size={20} />
        </button>

        {/* Hover Overlay */}
        {isHovered && (
          <div className="product-overlay">
            <div className="overlay-buttons">
              <button
                className="overlay-btn view-btn"
                onClick={handleViewDetails}
              >
                <span>View Details</span>
              </button>
              <button
                className="overlay-btn add-btn"
                onClick={handleAddToCart}
              >
                <ShoppingCart size={18} />
                <span>Add to Cart</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="product-info">
        {/* Category Badge */}
        <div
          className="category-badge"
          style={{ backgroundColor: `${categoryColor}20`, color: categoryColor }}
        >
          {category}
        </div>

        {/* Product Name */}
        <h3 className="product-name">{name}</h3>

        {/* Rating */}
        <div className="product-rating">
          <div className="stars">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={14}
                className={i < Math.floor(rating || 0) ? 'filled' : 'empty'}
              />
            ))}
          </div>
          <span className="review-count">({reviewCount || 0})</span>
        </div>

        {/* Price */}
        <div className="product-footer">
          <span className="product-price">{formatINR(price)}</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
