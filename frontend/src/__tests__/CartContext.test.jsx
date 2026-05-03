import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { CartProvider, useCart } from '../context/CartContext';

const wrapper = ({ children }) => <CartProvider>{children}</CartProvider>;

const sampleProduct = { id: 1, name: 'Gold Ring', price: '500.00', image_url: '/ring.jpg' };
const sampleProduct2 = { id: 2, name: 'Silver Necklace', price: '200.00', image_url: '/necklace.jpg' };

beforeEach(() => {
  localStorage.clear();
});

describe('CartContext', () => {
  it('starts with an empty cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    expect(result.current.cart).toEqual([]);
    expect(result.current.itemCount).toBe(0);
    expect(result.current.total).toBe(0);
  });

  it('adds an item to the cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.addToCart(sampleProduct, 1));
    expect(result.current.cart).toHaveLength(1);
    expect(result.current.cart[0].name).toBe('Gold Ring');
    expect(result.current.itemCount).toBe(1);
  });

  it('increments quantity when adding existing item', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.addToCart(sampleProduct, 1));
    act(() => result.current.addToCart(sampleProduct, 2));
    expect(result.current.cart).toHaveLength(1);
    expect(result.current.cart[0].quantity).toBe(3);
    expect(result.current.itemCount).toBe(3);
  });

  it('removes an item from the cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.addToCart(sampleProduct, 1));
    act(() => result.current.removeFromCart(sampleProduct.id));
    expect(result.current.cart).toHaveLength(0);
  });

  it('updates item quantity', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.addToCart(sampleProduct, 1));
    act(() => result.current.updateQuantity(sampleProduct.id, 5));
    expect(result.current.cart[0].quantity).toBe(5);
    expect(result.current.itemCount).toBe(5);
  });

  it('removes item when quantity updated to 0', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.addToCart(sampleProduct, 2));
    act(() => result.current.updateQuantity(sampleProduct.id, 0));
    expect(result.current.cart).toHaveLength(0);
  });

  it('calculates correct total with multiple items', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.addToCart(sampleProduct, 2));    // 500 * 2 = 1000
    act(() => result.current.addToCart(sampleProduct2, 3));   // 200 * 3 = 600
    expect(result.current.total).toBe(1600);
    expect(result.current.itemCount).toBe(5);
  });

  it('clears the cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.addToCart(sampleProduct, 2));
    act(() => result.current.addToCart(sampleProduct2, 1));
    act(() => result.current.clearCart());
    expect(result.current.cart).toHaveLength(0);
    expect(result.current.total).toBe(0);
    expect(result.current.itemCount).toBe(0);
  });
});
