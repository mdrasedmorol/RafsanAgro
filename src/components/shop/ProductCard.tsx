'use client';

import React from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import { useCartStore } from '@/stores/cart-store';
import { formatPrice, calcDiscountPercent } from '@/lib/utils';
import type { DemoProduct } from '@/lib/demo-data';

interface ProductCardProps {
  product: DemoProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { t, lang } = useI18n();
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);

  const name = lang === 'bn' ? product.nameBn : product.nameEn;
  const effectivePrice = product.discountPrice ?? product.price;
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const discountPercent = hasDiscount
    ? calcDiscountPercent(product.price, product.discountPrice!)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: product.id,
      nameEn: product.nameEn,
      nameBn: product.nameBn,
      price: product.price,
      discountPrice: product.discountPrice,
      image: product.images[0] || '',
      unit: product.unit,
      stock: product.stock,
    });
    openCart();
  };

  return (
    <div className="product-card" id={`product-${product.id}`}>
      <Link href={`/products/${product.slug}`}>
        <div className="product-card-image">
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '4rem',
              background: 'linear-gradient(135deg, var(--green-50), var(--earth-50))',
              overflow: 'hidden',
            }}
          >
            {product.images && product.images[0] && (product.images[0].startsWith('http') || product.images[0].startsWith('/images/products/')) ? (
              <img
                src={product.images[0]}
                alt={name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            ) : (
              <>
                {product.categorySlug === 'seeds' && '🌱'}
                {product.categorySlug === 'fertilizers' && '🧪'}
                {product.categorySlug === 'pesticides' && '🛡️'}
                {product.categorySlug === 'farm-tools' && '🔧'}
                {product.categorySlug === 'irrigation' && '💧'}
                {product.categorySlug === 'animal-feed' && '🐄'}
              </>
            )}
          </div>
          <div className="product-card-badge">
            {hasDiscount && (
              <span className="discount-badge">{discountPercent}% {t.product.off}</span>
            )}
            {product.isFeatured && (
              <span className="featured-badge">⭐ Featured</span>
            )}
          </div>
        </div>

        <div className="product-card-body">
          <span className="product-card-category">
            {lang === 'bn' ? product.categoryName : product.categoryName}
          </span>
          <h3 className="product-card-name">{name}</h3>
          <div className="product-card-price">
            <span className="product-card-current-price">{formatPrice(effectivePrice)}</span>
            {hasDiscount && (
              <span className="product-card-original-price">{formatPrice(product.price)}</span>
            )}
            <span className="product-card-unit">/ {product.unit}</span>
          </div>
        </div>
      </Link>

      <div className="product-card-footer">
        <button
          className="add-to-cart-btn"
          onClick={handleAddToCart}
          disabled={product.stock <= 0}
          id={`add-to-cart-${product.id}`}
        >
          {product.stock > 0 ? (
            <>🛒 {t.common.addToCart}</>
          ) : (
            t.common.outOfStock
          )}
        </button>
      </div>
    </div>
  );
}
