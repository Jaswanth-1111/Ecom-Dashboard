import { createSelector } from "@reduxjs/toolkit";

const selectCartItems = (state) => state.cart.cartItems;

export const selectCartTotal = createSelector(
  [selectCartItems],
  (items) => items.reduce((total, item) => total + item.price * item.quantity, 0)
);

export const selectCartCount = createSelector(
  [selectCartItems],
  (items) => items.reduce((count, item) => count + item.quantity, 0)
);