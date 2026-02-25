import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import productReducer from "./productSlice";
import cartReducer from "./cartSlice";

const loadState = () => {
  try {
    const serialized = localStorage.getItem("cartState");
    if (!serialized) return undefined;
    return JSON.parse(serialized);
  } catch (err) {
    return undefined;
  }
};

const saveState = (state) => {
  try {
    const serialized = JSON.stringify({
      cart: state.cart,
    });
    localStorage.setItem("cartState", serialized);
  } catch (err) {}
};

const preloadedState = loadState();

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    cart: cartReducer,
  },
  preloadedState,
});

store.subscribe(() => {
  saveState(store.getState());
});