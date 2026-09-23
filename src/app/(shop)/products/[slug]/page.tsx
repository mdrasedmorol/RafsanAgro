'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useI18n } from '@/lib/i18n';
import { useCartStore } from '@/stores/cart-store';
import { demoProducts } from '@/lib/demo-data';
import { formatPrice, calcDiscountPercent } from '@/lib/utils';
import ProductCard from '@/components/shop/ProductCard';

export default function ProductDetailPage() {
  const { t, lang } = useI18n();
  const params = useParams();
  const slug = params.slug as string;
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);

  const product = demoProducts.find((p) => p.slug === slug);
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <div className="container" style={{ padding: 'var(--space-20) var(--container-padding)', textAlign: 'center' }}>
        <div className="empty-state">
          <div className="empty-state-icon">😕</div>
          <h2 className="empty-state-title">Product Not Found</h2>
          <Link href="/products" className="btn btn-primary" style={{ marginTop: 'var(--space-4)' }}>
            {t.common.back} → {t.common.products}
          </Link>
        </div>
      </div>
    );
  }

  const name = lang === 'bn' ? product.nameBn : product.nameEn;
  const description = lang === 'bn' ? product.descriptionBn : product.descriptionEn;
  const effectivePrice = product.discountPrice ?? product.price;
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const discountPercent = hasDiscount ? calcDiscountPercent(product.price, product.discountPrice!) : 0;

  const relatedProducts = demoProducts
    .filter((p) => p.categoryId === product.categoryId && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
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
    }
    openCart();
  };

  const categoryIcon = {
    seeds: '🌱',
    fertilizers: '🧪',
    pesticides: '🛡️',
    'farm-tools': '🔧',
    irrigation: '💧',
    'animal-feed': '🐄',
  }[product.categorySlug] || '📦';

  return (
    <div className="page-enter">
      {/* Breadcrumb */}
      <div className="container" style={{ padding: 'var(--space-4) var(--container-padding)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)' }}>
          <Link href="/" style={{ color: 'var(--text-tertiary)' }}>{t.common.home}</Link>
          <span>/</span>
          <Link href="/products" style={{ color: 'var(--text-tertiary)' }}>{t.common.products}</Link>
          <span>/</span>
          <span style={{ color: 'var(--text-primary)' }}>{name}</span>
        </div>
      </div>

      <div className="container product-page">
        <div className="product-detail">
          {/* Gallery */}
          <div className="product-gallery">
            <div className="product-main-image">
              <span>{categoryIcon}</span>
            </div>
          </div>

          {/* Info */}
          <div className="product-info">
            <span className="badge badge-primary" style={{ marginBottom: 'var(--space-3)' }}>
              {product.categoryName}
            </span>
            <h1>{name}</h1>

            {/* Price */}
            <div className="product-info-price">
              <span className="product-info-current">{formatPrice(effectivePrice)}</span>
              {hasDiscount && (
                <>
                  <span className="product-info-original">{formatPrice(product.price)}</span>
                  <span className="product-info-discount">-{discountPercent}%</span>
                </>
              )}
            </div>

            {/* Stock Status */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
              {product.stock > 0 ? (
                <span className="badge badge-success">
                  <span className="status-dot" /> {t.common.inStock} ({product.stock})
                </span>
              ) : (
                <span className="badge badge-error">
                  <span className="status-dot" /> {t.common.outOfStock}
                </span>
              )}
              {product.sku && (
                <span className="text-sm text-muted">SKU: {product.sku}</span>
              )}
            </div>

            {/* Description */}
            <div style={{ marginBottom: 'var(--space-8)' }}>
              <h3 style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--space-3)' }}>{t.product.description}</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 'var(--leading-relaxed)' }}>
                {description}
              </p>
            </div>

            {/* Specs */}
            <div
              style={{
                background: 'var(--bg-tertiary)',
                borderRadius: 'var(--radius-xl)',
                padding: 'var(--space-6)',
                marginBottom: 'var(--space-8)',
              }}
            >
              <h3 style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--space-4)' }}>
                {t.product.specifications}
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                <div>
                  <span className="text-sm text-muted">{t.product.category}</span>
                  <p className="font-semibold">{product.categoryName}</p>
                </div>
                <div>
                  <span className="text-sm text-muted">{t.product.unit}</span>
                  <p className="font-semibold">{product.unit}</p>
                </div>
                {product.weight && (
                  <div>
                    <span className="text-sm text-muted">{lang === 'bn' ? 'ওজন' : 'Weight'}</span>
                    <p className="font-semibold">{product.weight}</p>
                  </div>
                )}
                {product.brand && (
                  <div>
                    <span className="text-sm text-muted">{lang === 'bn' ? 'ব্র্যান্ড' : 'Brand'}</span>
                    <p className="font-semibold">{product.brand}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Add to Cart */}
            {product.stock > 0 && (
              <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  border: '1.5px solid var(--border-medium)',
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                }}>
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    style={{
                      width: 44,
                      height: 44,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 'var(--text-lg)',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    −
                  </button>
                  <span style={{
                    width: 44,
                    height: 44,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    borderLeft: '1px solid var(--border-light)',
                    borderRight: '1px solid var(--border-light)',
                  }}>
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    style={{
                      width: 44,
                      height: 44,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 'var(--text-lg)',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    +
                  </button>
                </div>
                <button className="btn btn-primary btn-lg" onClick={handleAddToCart} style={{ flex: 1 }}>
                  🛒 {t.common.addToCart}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section style={{ marginTop: 'var(--space-16)' }}>
            <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, marginBottom: 'var(--space-8)' }}>
              {t.product.relatedProducts}
            </h2>
            <div className="grid-products">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
