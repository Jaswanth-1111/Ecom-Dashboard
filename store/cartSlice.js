import { createSlice, createSelector } from "@reduxjs/toolkit";

const initialState = {
  cartItems: [],
  wishlistItems: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const existingItem = state.cartItems.find(
        (item) => item.id === action.payload.id
      );

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.cartItems.push({ ...action.payload, quantity: 1 });
      }
    },

    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter(
        (item) => item.id !== action.payload
      );
    },

    incrementQuantity: (state, action) => {
      const item = state.cartItems.find(
        (item) => item.id === action.payload
      );
      if (item) item.quantity += 1;
    },

    decrementQuantity: (state, action) => {
      const item = state.cartItems.find(
        (item) => item.id === action.payload
      );
      if (item && item.quantity > 1) item.quantity -= 1;
    },

    toggleWishlist: (state, action) => {
      const exists = state.wishlistItems.find(
        (item) => item.id === action.payload.id
      );

      if (exists) {
        state.wishlistItems = state.wishlistItems.filter(
          (item) => item.id !== action.payload.id
        );
      } else {
        state.wishlistItems.push(action.payload);
      }
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  incrementQuantity,
  decrementQuantity,
  toggleWishlist,
} = cartSlice.actions;

export default cartSlice.reducer;

const selectCartItems = (state) => state.cart.cartItems;

export const selectCartTotal = createSelector(
  [selectCartItems],
  (items) =>
    items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    )
);

export const selectCartCount = createSelector(
  [selectCartItems],
  (items) =>
    items.reduce((count, item) => count + item.quantity, 0)
);