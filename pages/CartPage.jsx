import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { removeFromCart, incrementQuantity, decrementQuantity } from "../features/cart/cartSlice";
import { selectCartTotal } from "../features/cart/cartSelectors";

const CartPage = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const totalPrice = useSelector(selectCartTotal);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return (
    <div style={{ padding: '40px 10%', backgroundColor: '#f4f7f6', minHeight: '100vh' }}>
      <button onClick={() => navigate(-1)} style={{ padding: '8px 15px', background: '#1a1e29', color: 'white', borderRadius: '5px', cursor: 'pointer', marginBottom: '20px', border: 'none' }}>
        ← Back
      </button>
      <h2 style={{ color: '#333', marginBottom: '20px' }}>Your Cart</h2>
      
      <div>
        {cartItems.length === 0 ? (
          <p style={{ fontSize: '18px', color: '#666' }}>Your cart is empty</p>
        ) : (
          cartItems.map((item) => (
            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', padding: '20px', marginBottom: '15px', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
              <div>
                <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>{item.title}</h3>
                <p style={{ fontWeight: 'bold', color: '#1a73e8', fontSize: '18px', margin: '0 0 15px 0' }}>₹ {item.price}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <span style={{ color: '#666' }}>Quantity:</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#f0f2f5', padding: '5px 10px', borderRadius: '8px' }}>
                    <button 
                      onClick={() => dispatch(decrementQuantity(item.id))} 
                      style={{ background: 'white', border: '1px solid #ddd', borderRadius: '4px', width: '28px', height: '28px', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                      -
                    </button>
                    <span style={{ fontWeight: 'bold', minWidth: '20px', textAlign: 'center' }}>{item.quantity}</span>
                    <button 
                      onClick={() => dispatch(incrementQuantity(item.id))} 
                      style={{ background: 'white', border: '1px solid #ddd', borderRadius: '4px', width: '28px', height: '28px', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
              <button onClick={() => dispatch(removeFromCart(item.id))} style={{ background: '#ff4d4d', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                Remove
              </button>

            </div>
          ))
        )}
      </div>
      {cartItems.length > 0 && (
        <div style={{ textAlign: 'right', marginTop: '30px', padding: '20px', background: 'white', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
          <h2 style={{ margin: 0, color: '#333' }}>Total: <span style={{ color: '#1a73e8' }}>₹ {totalPrice.toFixed(2)}</span></h2>
        </div>
      )}
    </div>
  );
};

export default CartPage;