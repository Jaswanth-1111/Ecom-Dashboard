import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { removeFromCart, incrementQuantity, decrementQuantity } from "../features/cart/cartSlice";
import { selectCartTotal } from "../features/cart/cartSelectors";
import "./CartPage.css";

const CartPage = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const totalPrice = useSelector(selectCartTotal);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return (
    <div className="cart-container">
      <button className="cart-back-btn" onClick={() => navigate(-1)}>← Back</button>
      <h2 className="cart-title">Your Cart</h2>
      
      <div>
        {cartItems.length === 0 ? (
          <p className="cart-empty-msg">Your cart is empty</p>
        ) : (
          cartItems.map((item) => (
            <div key={item.id} className="cart-item-card">
              <div>
                <h3 className="cart-item-title">{item.title}</h3>
                <p className="cart-item-price">₹ {item.price}</p>
                <div className="cart-qty-wrapper">
                  <span style={{ color: '#666' }}>Quantity:</span>
                  <div className="cart-qty-controls">
                    <button className="cart-qty-btn" onClick={() => dispatch(decrementQuantity(item.id))}>-</button>
                    <span className="cart-qty-text">{item.quantity}</span>
                    <button className="cart-qty-btn" onClick={() => dispatch(incrementQuantity(item.id))}>+</button>
                  </div>
                </div>
              </div>
              <button className="cart-remove-btn" onClick={() => dispatch(removeFromCart(item.id))}>Remove</button>
            </div>
          ))
        )}
      </div>
      
      {cartItems.length > 0 && (
        <div className="cart-total-section">
          <h2 className="cart-total-text">Total: <span className="cart-total-amount">₹ {totalPrice.toFixed(2)}</span></h2>
        </div>
      )}
    </div>
  );
};

export default CartPage;