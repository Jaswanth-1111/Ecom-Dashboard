import React, { useEffect, useState } from "react";
import "./App.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "./store/productSlice";
import { logout, clearMessages } from "./store/authSlice";
import { addToCart, toggleWishlist, removeFromCart } from "./store/cartSlice";
import { selectCartCount } from "./store/cartSlice";
import Signup from "./store/signup";
import Login from "./store/Login";
import Popup from "./store/Popup";
import CartSidebar from "./store/CartSidebar";

const ITEMS_PER_PAGE = 6;

const App = () => {
  const dispatch = useDispatch();
  const allProducts = useSelector(state => state.products.items) || [];
  const { user, error, success } = useSelector(state => state.auth);
  const { cartItems, wishlistItems } = useSelector((state) => state.cart);
  const cartCount = useSelector(selectCartCount);
  const [screen, setScreen] = useState("signup");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [activeRanges, setActiveRanges] = useState([]);
  const [showWishlistOnly, setShowWishlistOnly] = useState(false);

  useEffect(() => {
    if (user) {
      setScreen("home");
      dispatch(fetchProducts());
    }
  }, [user, dispatch]);

  const priceRanges = [
    { label: "0 - 100", min: 0, max: 100 },
    { label: "100 - 1000", min: 100, max: 1000 },
    { label: "1000 - 10000", min: 1000, max: 10000 }
  ];

  const baseProducts = showWishlistOnly
  ? wishlistItems
  : allProducts;

  const visibleProducts = baseProducts.filter(item => {
  const matchesSearch =
    item.title.toLowerCase().includes(searchText.toLowerCase());

  if (activeRanges.length === 0) {
    return matchesSearch;
  }

  const matchesPrice = activeRanges.some(label => {
    const range = priceRanges.find(r => r.label === label);
    if (!range) return false;
    return item.price >= range.min && item.price <= range.max;
  });

  return matchesSearch && matchesPrice;
  });

  const totalPages = Math.ceil(visibleProducts.length / ITEMS_PER_PAGE);
  const productsToShow = visibleProducts.slice((pageNumber - 1) * ITEMS_PER_PAGE, pageNumber * ITEMS_PER_PAGE);

  const renderContent = () => {
    if (screen === "signup") return <Signup goLogin={() => setScreen("login")} />;
    if (screen === "login") return <Login goSignup={() => setScreen("signup")} goHome={() => setScreen("home")} />;
    
    return (
      <>
        <div className="header-actions">
           <h1 className="main-title">Product Dashboard</h1>
        </div>

        <div className="search-wrapper">
          <div className="search-box">
            <input className="search" placeholder="Search products..." onChange={e => setSearchText(e.target.value)} />
          </div>
          <button className="wishlist-toggle-btn" onClick={() => setShowWishlistOnly (!showWishlistOnly)}>
            {showWishlistOnly ? "Show All Products" : "Show Wishlist "}
          </button>
        </div>

        <div className="layout">
          <aside className="sidebar">
            <h3>Price Filter</h3>
            {priceRanges.map(range => (
              <label key={range.label} className="filter-option">
                <input type="checkbox" onChange={() => { setPageNumber(1); setActiveRanges(prev => prev.includes(range.label) ? prev.filter(r => r !== range.label) : [...prev, range.label]); }} /> ${range.label}
              </label>
            ))}
            <button className="clear-btn" onClick={() => setActiveRanges([])}>Clear Filters</button>
            <div className="cart-summary">
            <h3>Cart Summary</h3>
            {cartItems.length === 0 ? (
            <p>No items in cart</p>
            ) : (
            <>
            {cartItems.map(item => (
            <div key={item.id}
              style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: "14px",
              marginBottom: "8px"
            }}>
          <span>
            {item.title} ({item.quantity})
          </span>
          <div>
            <span style={{ marginRight: "8px" }}>
              ${(item.price * item.quantity).toFixed(2)}
            </span>
            <button
              onClick={() => dispatch(removeFromCart(item.id))}
              style={{
                background: "none",
                border: "none",
                color: "red",
                cursor: "pointer",
                fontWeight: "bold"
              }}> ✕ </button>
          </div>
        </div>
      ))}
      <hr />
      <p>
        <strong>Total Items:</strong>{" "}
        {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
      </p>
      <p>
        <strong>Total Price:</strong> $
        {cartItems
          .reduce((total, item) => total + item.price * item.quantity, 0)
          .toFixed(2)}
      </p></>
          )}
          </div>
          </aside>
          <main className="main">
            {productsToShow.map(item => {
              const isWishlisted = wishlistItems.some(w => w.id === item.id);

              return (
                <div className="product-card" key={item.id}>
                  <span className="discount">{Math.round(item.discountPercentage)}% OFF</span>
                  <button 
                    className={`wishlist-btn ${isWishlisted ? 'active' : ''}`} 
                    onClick={() => dispatch(toggleWishlist(item))}
                  >
                    ❤
                  </button>
                  <img src={item.thumbnail} alt={item.title} />
                  <p className="name">{item.title}</p>
                  <p className="cost">${item.price}</p>
                  <div className="actions">
                    <button className="add-btn" onClick={() => dispatch(addToCart(item))}>
                      Add to Cart
                    </button>
                    <button className="add-btn" onClick={() => dispatch(toggleWishlist(item))}>
                      {isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                    </button>
                  </div>
                </div>
              );
            })}
          </main>
        </div>

        <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

        <div className="pagination">
          <button onClick={() => setPageNumber(p => Math.max(1, p - 1))}>Prev</button>
          {[...Array(totalPages)].map((_, i) => (
            <button key={i} className={pageNumber === i + 1 ? "active" : ""} onClick={() => setPageNumber(i + 1)}>{i + 1}</button>
          ))}
          <button onClick={() => setPageNumber(p => Math.min(totalPages, p + 1))}>Next</button>
        </div>

        <div className="logoutContainer">
          <button className="logoutBtn" onClick={() => { dispatch(logout()); setScreen("login"); }}>Logout</button>
        </div>
      </>
    );
  };

  return (
    <div className="app-container">
      {renderContent()}
      {(success || error) && (
        <Popup 
          message={success || error} 
          type={success ? "success" : "error"} 
          onClose={() => dispatch(clearMessages())} 
        />
      )}
    </div>
  );
};

export default App;