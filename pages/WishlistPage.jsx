import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toggleWishlist, addToCart } from "../features/cart/cartSlice";

const WishlistPage = () => {
  const { wishlistItems } = useSelector((state) => state.cart);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleMoveToCart = (item) => {
    dispatch(addToCart(item));
    dispatch(toggleWishlist(item));
  };

  return (
    <div style={{ padding: '40px 10%', backgroundColor: '#f4f7f6', minHeight: '100vh' }}>
      <button onClick={() => navigate(-1)} style={{ padding: '8px 15px', background: '#1a1e29', color: 'white', borderRadius: '5px', cursor: 'pointer', marginBottom: '20px' }}>
        ← Back
      </button>
      <h2>Your Wishlist</h2>
      
      <div>
        {wishlistItems.length === 0 ? (
          <p>Your wishlist is empty</p>
        ) : (
          wishlistItems.map((item) => (
            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', background: 'white', padding: '20px', marginBottom: '15px', borderRadius: '10px' }}>
              <div>
                <h3>{item.title}</h3>
                <p style={{ fontWeight: 'bold' }}>₹ {item.price}</p>
              </div>
              <div>
                <button onClick={() => handleMoveToCart(item)} style={{ background: '#1a1e29', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', marginRight: '10px' }}>
                  Move to Cart
                </button>
                <button onClick={() => dispatch(toggleWishlist(item))} style={{ background: '#ff4d4d', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer' }}>
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