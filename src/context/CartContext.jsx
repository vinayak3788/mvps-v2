//src/context/CartContext.jsx contents..

import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export function CartProvider({ children }) {
  // In-memory print orders (with raw File objects)
  const [printItems, setPrintItems] = useState([]);

  // Persisted stationery orders
  const [stationeryItems, setStationeryItems] = useState(() => {
    const stored = localStorage.getItem("mvps-cart-stationery");
    return stored ? JSON.parse(stored) : [];
  });
  useEffect(() => {
    localStorage.setItem(
      "mvps-cart-stationery",
      JSON.stringify(stationeryItems),
    );
  }, [stationeryItems]);

  const addToCart = (type, item) => {
    if (type === "print") {
      setPrintItems((prev) => {
        const existingIndex = prev.findIndex(
          (i) => i.id === item.id && i.color === item.color,
        );
        if (existingIndex !== -1) {
          const updated = [...prev];
          updated[existingIndex].quantity += item.quantity || 1;
          return updated;
        } else {
          return [...prev, { ...item, quantity: item.quantity || 1 }];
        }
      });
    } else {
      setStationeryItems((prev) => {
        const existingIndex = prev.findIndex(
          (i) => i.id === item.id && i.color === item.color,
        );
        if (existingIndex !== -1) {
          const updated = [...prev];
          updated[existingIndex].quantity += item.quantity || 1;
          return updated;
        } else {
          return [...prev, { ...item, quantity: item.quantity || 1 }];
        }
      });
    }
  };

  const removeFromCart = (type, idx) => {
    if (type === "print") {
      setPrintItems((prev) => prev.filter((_, i) => i !== idx));
    } else {
      setStationeryItems((prev) => prev.filter((_, i) => i !== idx));
    }
  };

  const clearCart = () => {
    setPrintItems([]);
    setStationeryItems([]);
    localStorage.removeItem("mvps-cart-stationery");
  };

  return (
    <CartContext.Provider
      value={{
        cartItems: { print: printItems, stationery: stationeryItems },
        addToCart,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
