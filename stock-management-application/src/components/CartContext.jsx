// src/context/CartContext.js
import React, { createContext, useState } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // ...existing code...
  const addToCart = (product) => {
    try {
      setCart((prevCart) => {
        // Enforce same customer
        if (prevCart.length > 0) {
          const cartCustomer = prevCart[0]?.customer;
          const incomingCustomer = product?.customer;
          if (
            cartCustomer &&
            incomingCustomer &&
            cartCustomer !== incomingCustomer
          ) {
            alert("Cannot add items for a different customer to the cart.");
            return prevCart; // No changes made
          }
        }

        const sameImported = (a, b) => {
          const toBool = (v) =>
            typeof v === "string" ? v.toLowerCase() === "true" : Boolean(v);
          return toBool(a) === toBool(b);
        };

        const idx = prevCart.findIndex(
          (item) =>
            item.product_id === product.product_id &&
            item.color === product.color &&
            sameImported(
              item.imported ?? item.isimported,
              product.imported ?? product.isimported
            )
        );

        if (idx !== -1) {
          const updated = [...prevCart];
          const currentQty = parseFloat(updated[idx].quantity) || 0;
          const addQty = parseFloat(product.quantity) || 1;
          updated[idx] = { ...updated[idx], quantity: currentQty + addQty };
          return updated;
        }

        const initialQty = parseFloat(product.quantity ?? 1) || 1;
        return [...prevCart, { ...product, quantity: initialQty }];
      });
    } catch (err) {
      console.error("Error while adding to cart:", err);
      throw err; // let caller handle it
    }
  };
  // ...existing code...

  const removeFromCart = (productId) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item.product_id !== productId)
    );
    alert("Removed product with ID: " + productId);
  };

  const updateCartItem = (productId, updatedInfo) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product_id === productId ? { ...item, ...updatedInfo } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateCartItem, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};
