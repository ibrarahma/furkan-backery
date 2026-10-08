import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { CartItem, CartTotals } from '../types/cart';
import { SAMPLE_COUPONS } from '../data/sampleCakes';
import { getBakeryConfig } from '../config/bakeryConfig';
import { storage } from '../services/storage';

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  totals: CartTotals;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (item: CartItem) => void;
  updateQuantity: (id: string, delta: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  appliedCoupon: string | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
}

const CART_STORAGE_KEY = 'sweetcrumbs_cart_v1';
const COUPON_STORAGE_KEY = 'sweetcrumbs_applied_coupon_v1';

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    return storage.get<CartItem[]>(CART_STORAGE_KEY, []);
  });

  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(() => {
    return storage.get<string | null>(COUPON_STORAGE_KEY, null);
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  // Sync with storage
  useEffect(() => {
    storage.set(CART_STORAGE_KEY, items);
  }, [items]);

  useEffect(() => {
    if (appliedCoupon) {
      storage.set(COUPON_STORAGE_KEY, appliedCoupon);
    } else {
      storage.remove(COUPON_STORAGE_KEY);
    }
  }, [appliedCoupon]);

  const config = getBakeryConfig();

  const totals = useMemo<CartTotals>(() => {
    const subtotal = items.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);

    // Calculate delivery charge
    let deliveryCharge = 0;
    if (subtotal > 0) {
      if (subtotal >= config.freeDeliveryThreshold) {
        deliveryCharge = 0;
      } else {
        deliveryCharge = config.deliveryCharges;
      }
    }

    // Free delivery progress
    const freeDeliveryRemaining = Math.max(0, config.freeDeliveryThreshold - subtotal);

    // Calculate coupon discount
    let discount = 0;
    if (appliedCoupon && subtotal > 0) {
      const couponObj = SAMPLE_COUPONS.find(
        (c) => c.code.toUpperCase() === appliedCoupon.toUpperCase() && c.active
      );

      if (couponObj && subtotal >= couponObj.minOrderValue) {
        if (couponObj.discountPercentage) {
          discount = Math.round((subtotal * couponObj.discountPercentage) / 100);
        } else if (couponObj.flatDiscount) {
          discount = couponObj.flatDiscount;
        }
      }
    }

    const total = Math.max(0, subtotal - discount + deliveryCharge);

    return {
      subtotal,
      deliveryCharge,
      discount,
      total,
      freeDeliveryRemaining,
      appliedCouponCode: discount > 0 ? appliedCoupon : null
    };
  }, [items, appliedCoupon, config.deliveryCharges, config.freeDeliveryThreshold]);

  const itemCount = useMemo(() => {
    return items.reduce((acc, item) => acc + item.quantity, 0);
  }, [items]);

  const addToCart = (newItem: CartItem) => {
    setItems((prev) => {
      // Check if identical item exists (same cakeId, size, flavour, eggless, message)
      const existingIdx = prev.findIndex(
        (i) =>
          i.cakeId === newItem.cakeId &&
          i.size === newItem.size &&
          i.flavour === newItem.flavour &&
          i.isEggless === newItem.isEggless &&
          i.cakeMessage.trim() === newItem.cakeMessage.trim()
      );

      if (existingIdx > -1) {
        const copy = [...prev];
        copy[existingIdx].quantity += newItem.quantity;
        return copy;
      }
      return [...prev, newItem];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setItems((prev) => {
      return prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null);
    });
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null);
  };

  const applyCoupon = (code: string) => {
    const trimmed = code.trim().toUpperCase();
    const couponObj = SAMPLE_COUPONS.find((c) => c.code.toUpperCase() === trimmed && c.active);

    if (!couponObj) {
      return { success: false, message: 'Invalid or expired coupon code.' };
    }

    const currentSubtotal = items.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
    if (currentSubtotal < couponObj.minOrderValue) {
      return {
        success: false,
        message: `Minimum order of ₹${couponObj.minOrderValue} required for ${couponObj.code}.`
      };
    }

    setAppliedCoupon(trimmed);
    return {
      success: true,
      message: `Coupon "${trimmed}" applied! (${couponObj.description})`
    };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        totals,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        appliedCoupon,
        applyCoupon,
        removeCoupon
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
