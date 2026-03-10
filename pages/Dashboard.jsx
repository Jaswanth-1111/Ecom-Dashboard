import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"
import { fetchProducts } from "../features/products/productSlice";
import { logout } from "../features/auth/authSlice";
import { addToCart, toggleWishlist, removeFromCart } from "../features/cart/cartSlice";
import { selectCartTotal, selectCartCount } from "../features/cart/cartSelectors";
import "./Dashboard.css";
import "../features/products/productCard.css";

const ITEMS_PER_PAGE = 6;

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const allProducts = useSelector(state => state.products.items) || [];
  const { cartItems, wishlistItems } = useSelector((state) => state.cart);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [activeRanges, setActiveRanges] = useState([]);
  const [showWishlistOnly, setShowWishlistOnly] = useState(false);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const priceRanges = [
    { label: "0 - 100", min: 0, max: 100 },
    { label: "100 - 1000", min: 100, max: 1000 },
    { label: "1000 - 10000", min: 1000, max: 10000 }
  ];

  const baseProducts = showWishlistOnly ? wishlistItems : allProducts;
  const visibleProducts = baseProducts.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchText.toLowerCase());
    if (activeRanges.length === 0) return matchesSearch;

    const matchesPrice = activeRanges.some(label => {
      const range = priceRanges.find(r => r.label === label);
      if (!range) return false;
      return item.price >= range.min && item.price <= range.max;
    });
    return matchesSearch && matchesPrice;
  });

  const totalPages = Math.ceil(visibleProducts.length / ITEMS_PER_PAGE);
  const productsToShow = visibleProducts.slice((pageNumber - 1) * ITEMS_PER_PAGE, pageNumber * ITEMS_PER_PAGE);

  return (
    <>
      <div className="header-actions">
         <h1 className="main-title">Product Dashboard</h1>
      </div>

      <div className="search-wrapper">
        <div className="search-box">
          <input className="search" placeholder="Search products..." onChange={e => setSearchText(e.target.value)} />
        </div>
        <div className="header-actions-right">
          <button className="icon-btn" onClick={() => navigate("/wishlist")}>❤️ Wishlist
            ({wishlistItems.length})
          </button>
          <button className="icon-btn" onClick={() => navigate("/cart")}>🛒 Cart
            ({cartItems.length})
          </button>
      </div>
      </div>

      <div className="layout">
        <aside className="sidebar">
          <h3>Price Filter</h3>
          {priceRanges.map(range => (
            <label key={range.label} className="filter-option">
              <input type="checkbox" onChange={() => { 
                setPageNumber(1); 
                setActiveRanges(prev => prev.includes(range.label) ? prev.filter(r => r !== range.label) : [...prev, range.label]); 
              }} /> ${range.label}
            </label>
          ))}
          <button className="clear-btn" onClick={() => setActiveRanges([])}>Clear Filters</button>
          </aside>

        <main className="main">
          {productsToShow.map(item => {
            const isWishlisted = wishlistItems.some(w => w.id === item.id);
            return (
              <div className="product-card" key={item.id}>
                <span className="discount">{Math.round(item.discountPercentage)}% OFF</span>
                <img src={item.thumbnail} alt={item.title} />
                <p className="name">{item.title}</p>
                <p className="cost">${item.price}</p>
                <div className="actions">
                  <button className="add-btn" onClick={() => dispatch(addToCart(item))}>Add to Cart</button>
                  <button className="add-btn" onClick={() => dispatch(toggleWishlist(item))}>
                    {isWishlisted ? "Remove Wishlist" : "Add Wishlist"}
                  </button>
                </div>
              </div>
            );
          })}
        </main>
      </div>

      <div className="pagination">
        {[...Array(totalPages)].map((_, i) => (
          <button key={i} className={pageNumber === i + 1 ? "active" : ""} onClick={() => setPageNumber(i + 1)}>{i + 1}</button>
        ))}
      </div>

      <div className="logoutContainer">
        <button className="logoutBtn" onClick={() => { 
          dispatch(logout()); 
          navigate("/login");
        }}>Logout</button>
      </div>
    </>
  );
};

export default Dashboard;