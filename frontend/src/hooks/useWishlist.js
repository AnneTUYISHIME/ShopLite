import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';

export function useWishlist() {
  const token = localStorage.getItem('token');
  const [wishlistIds, setWishlistIds] = useState(new Set());

  useEffect(() => {
    if (!token) return;
    api.get('/wishlist/ids')
      .then((res) => setWishlistIds(new Set(res.data)))
      .catch(() => {});
  }, [token]);

  const toggleWishlist = useCallback(async (productId, isWishlisted) => {
    // Optimistic update so the heart flips instantly.
    setWishlistIds((prev) => {
      const next = new Set(prev);
      if (isWishlisted) next.delete(productId);
      else next.add(productId);
      return next;
    });

    try {
      if (isWishlisted) {
        await api.delete(`/wishlist/${productId}`);
      } else {
        await api.post(`/wishlist/${productId}`);
      }
    } catch {
      // Revert on failure.
      setWishlistIds((prev) => {
        const next = new Set(prev);
        if (isWishlisted) next.add(productId);
        else next.delete(productId);
        return next;
      });
    }
  }, []);

  return { wishlistIds, toggleWishlist };
}
