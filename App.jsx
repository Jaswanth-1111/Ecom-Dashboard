import React, { useEffect, useState } from "react";
import "./App.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "./store/productSlice";
import { logout, clearMessages } from "./store/authSlice";
import Signup from "./store/signup";
import Login from "./store/Login";
import Popup from "./store/Popup";

const ITEMS_PER_PAGE = 6;

const App = () => {
  const dispatch = useDispatch();
  const allProducts = useSelector(state => state.products.items) || [];
  const { user, error, success } = useSelector(state => state.auth);

  const [screen, setScreen] = useState("signup");
  const [pageNumber, setPageNumber] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [activeRanges, setActiveRanges] = useState([]);

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

  const visibleProducts = allProducts.filter(item => 
    item?.title?.toLowerCase().includes(searchText.toLowerCase()) && 
    (activeRanges.length === 0 || activeRanges.some(label => {
      const range = priceRanges.find(r => r.label === label);
      return item.price >= range.min && item.price <= range.max;
    }))
  );

  const totalPages = Math.ceil(visibleProducts.length / ITEMS_PER_PAGE);
  const productsToShow = visibleProducts.slice((pageNumber - 1) * ITEMS_PER_PAGE, pageNumber * ITEMS_PER_PAGE);

  const renderContent = () => {
    if (screen === "signup") return <Signup goLogin={() => setScreen("login")} />;
    if (screen === "login") return <Login goSignup={() => setScreen("signup")} goHome={() => setScreen("home")} />;
    
    return (
      <>
        <h1 className="main-title">Product Dashboard</h1>
        <div className="search-wrapper">
          <div className="search-box">
            <input className="search" placeholder="Search products..." onChange={e => setSearchText(e.target.value)} />
          </div>
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
          </aside>
          <main className="main">
            {productsToShow.map(item => (
              <div className="product-card" key={item.id}>
                <span className="discount">{Math.round(item.discountPercentage)}% OFF</span>
                <img src={item.thumbnail} alt={item.title} />
                <p className="name">{item.title}</p>
                <p className="cost">${item.price}</p>
                <div className="actions">
                  <button className="add-btn">Add to Cart</button>
                  <button className="remove-btn">Remove</button>
                </div>
              </div>
            ))}
          </main>
        </div>
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