import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, incrementQuantity, decrementQuantity, selectCartTotal } from "./cartSlice";

const CartSidebar = ({ isOpen, onClose }) => {
  const { cartItems } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  if (!isOpen) return null;

  return (
    <div className="cart-sidebar">
      <div className="cart-header">
        <h2>Your Cart</h2>
        <button onClick={onClose}>X</button>
      </div>
      <div className="cart-content">
        {cartItems.length === 0 ? (
          <p>Your cart is empty</p>
        ) : (
          cartItems.map((item) => (
            <div key={item.id} className="cart-item">
              <img src={item.thumbnail} alt={item.title} />
              <div>
                <p>{item.title}</p>
                <p>${item.price} x {item.quantity}</p>
                <div className="quantity-controls">
                <button onClick={() => dispatch(decrementQuantity(item.id))}>
                  -
                </button>
                <span>{item.quantity}</span>
                <button onClick={() => dispatch(incrementQuantity(item.id))}>
                  +
                </button>
                </div>
                <button onClick={() => dispatch(removeFromCart(item.id))}>Remove</button>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="cart-footer">
        <h3>Total: ${totalPrice.toFixed(2)}</h3>
        <button className="checkout-btn">Checkout</button>
      </div>
    </div>
  );
};

export default CartSidebar;