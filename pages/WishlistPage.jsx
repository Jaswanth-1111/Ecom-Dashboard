import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toggleWishlist, addToCart } from "../features/cart/cartSlice";
import "./WishlistPage.css";

const WishlistPage = () => {
  const { wishlistItems } = useSelector((state) => state.cart);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleMoveToCart = (item) => {
    dispatch(addToCart(item));
    dispatch(toggleWishlist(item)); 
  };

  return (
    <div className="wishlist-container">
      <button className="wishlist-back-btn" onClick={() => navigate(-1)}>← Back</button>
      <h2 className="wishlist-title">Your Wishlist</h2>
      
      <div>
        {wishlistItems.length === 0 ? (
          <p className="wishlist-empty-msg">Your wishlist is empty</p>
        ) : (
          wishlistItems.map((item) => (
            <div key={item.id} className="wishlist-item-card">
              <div>
                <h3 className="wishlist-item-title">{item.title}</h3>
                <p className="wishlist-item-price">₹ {item.price}</p>
              </div>
              <div>
                <button className="wishlist-move-btn" onClick={() => handleMoveToCart(item)}>
                  Move to Cart
                </button>
                <button className="wishlist-remove-btn" onClick={() => dispatch(toggleWishlist(item))}>
                  Remove
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default WishlistPage;