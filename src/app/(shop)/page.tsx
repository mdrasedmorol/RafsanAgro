'use client';

import React from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import { demoProducts, demoCategories } from '@/lib/demo-data';
import ProductCard from '@/components/shop/ProductCard';

export default function HomePage() {
  const { t, lang } = useI18n();
  const [categories, setCategories] = React.useState<any[]>(demoCategories);
  const [productsList, setProductsList] = React.useState<any[]>(demoProducts);

  React.useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setCategories(json.data);
        }
      })
      .catch(() => {});

    fetch('/api/products')
      .then((res) => res.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setProductsList(json.data);
        }
      })
      .catch(() => {});
  }, []);

  const featuredProducts = productsList.filter((p) => p.isFeatured);
  const allProducts = productsList.filter((p) => p.isActive);

  return (
    <div className="page-enter">
      {/* Hero Section */}
      <section className="hero relative overflow-hidden" id="hero-section">
        {/* Sparkle dots */}
        <div className="absolute top-[15%] right-[35%] w-2 h-2 rounded-full bg-emerald-400 animate-sparkle pointer-events-none" style={{ animationDelay: '0.5s' }} />
        <div className="absolute top-[40%] right-[8%] w-3 h-3 rounded-full bg-emerald-300 animate-sparkle pointer-events-none" style={{ animationDelay: '1.2s' }} />
        <div className="absolute bottom-[30%] right-[40%] w-2 h-2 rounded-full bg-emerald-500 animate-sparkle pointer-events-none" style={{ animationDelay: '0.8s' }} />

        <div className="hero-content relative z-10">
          {/* Badge — bounce in */}
          <div
            className="hero-badge animate-bounce-in"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', animationDelay: '0.1s' }}
          >
            <img src="/images/logo.png" alt="Rafsan Agro" style={{ height: '28px', width: 'auto', background: '#fff', borderRadius: '4px', padding: '2px' }} />
            {lang === 'bn' ? 'বিশ্বস্ত কৃষি পণ্য সরবরাহকারী' : 'Trusted Agricultural Supplier'}
          </div>

          {/* Heading — slide up with shimmer highlight */}
          <h1 className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
            {lang === 'bn' ? (
              <>
                <span className="hero-highlight inline-block bg-[length:200%_auto] animate-text-shimmer" style={{ backgroundImage: 'linear-gradient(90deg, #4BA625, #66c23a, #8dd463, #66c23a, #4BA625)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  প্রিমিয়াম
                </span>{' '}
                কৃষি পণ্য উন্নত চাষের জন্য
              </>
            ) : (
              <>
                <span className="hero-highlight inline-block bg-[length:200%_auto] animate-text-shimmer" style={{ backgroundImage: 'linear-gradient(90deg, #4BA625, #66c23a, #8dd463, #66c23a, #4BA625)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  Premium
                </span>{' '}
                Agricultural Products for Better Farming
              </>
            )}
          </h1>

          {/* Subtitle — slide in from left */}
          <p className="animate-slide-in-left" style={{ animationDelay: '0.35s' }}>
            {t.hero.subtitle}
          </p>

          {/* Action buttons — staggered slide up with glow on primary */}
          <div className="hero-actions animate-slide-up" style={{ animationDelay: '0.5s' }}>
            <Link href="/products" className="hero-btn-primary animate-glow-pulse transition-all duration-300 hover:scale-105 hover:-translate-y-1" id="hero-cta" style={{ animationDelay: '0.7s' }}>
              {t.hero.cta} →
            </Link>
            <Link href="/categories" className="hero-btn-secondary transition-all duration-300 hover:scale-105 hover:-translate-y-0.5" id="hero-categories">
              {t.hero.ctaSecondary}
            </Link>
          </div>

          {/* Stats — staggered count-up animation */}
          <div className="hero-stats">
            <div className="hero-stat animate-count-up" style={{ animationDelay: '0.6s' }}>
              <div className="hero-stat-value">500+</div>
              <div className="hero-stat-label">{lang === 'bn' ? 'পণ্যসমূহ' : 'Products'}</div>
            </div>
            <div className="hero-stat animate-count-up" style={{ animationDelay: '0.75s' }}>
              <div className="hero-stat-value">10K+</div>
              <div className="hero-stat-label">{lang === 'bn' ? 'সন্তুষ্ট কৃষক' : 'Happy Farmers'}</div>
            </div>
            <div className="hero-stat animate-count-up" style={{ animationDelay: '0.9s' }}>
              <div className="hero-stat-value">64</div>
              <div className="hero-stat-label">{lang === 'bn' ? 'জেলায় ডেলিভারি' : 'Districts Covered'}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="section" id="categories-section">
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">{t.common.categories}</h2>
              <p className="section-subtitle">
                {lang === 'bn' ? 'আপনার প্রয়োজন অনুযায়ী পণ্য খুঁজুন' : 'Browse products by category'}
              </p>
            </div>
            <Link href="/categories" className="section-link">
              {t.common.viewAll} →
            </Link>
          </div>
          {categories.length > 0 ? (
            <div className="category-grid">
              {categories.map((cat) => (
                <Link href={`/products?category=${cat.slug}`} key={cat.id}>
                  <div className="category-card" id={`cat-${cat.slug}`}>
                    <span className="category-card-icon">{cat.icon}</span>
                    <h3 className="category-card-name">
                      {lang === 'bn' ? cat.nameBn : cat.nameEn}
                    </h3>
                    <span className="category-card-count">
                      {cat.productCount} {lang === 'bn' ? 'টি পণ্য' : 'products'}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-tertiary)' }}>
              {lang === 'bn' ? 'কোনো ক্যাটাগরি পাওয়া যায়নি।' : 'No categories available yet.'}
            </div>
          )}
        </div>
      </section>

      {/* Featured Products */}
      <section className="section" style={{ background: 'var(--bg-tertiary)' }} id="featured-section">
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">{t.product.featured}</h2>
              <p className="section-subtitle">
                {lang === 'bn' ? 'আমাদের সেরা পণ্যসমূহ' : 'Our handpicked best products'}
              </p>
            </div>
            <Link href="/products" className="section-link">
              {t.common.viewAll} →
            </Link>
          </div>
          {featuredProducts.length > 0 ? (
            <div className="grid-products">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-tertiary)' }}>
              {lang === 'bn' ? 'কোনো ফিচার্ড পণ্য পাওয়া যায়নি।' : 'No featured products yet.'}
            </div>
          )}
        </div>
      </section>

      {/* All Products */}
      <section className="section" id="all-products-section">
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">{t.common.allProducts}</h2>
              <p className="section-subtitle">
                {lang === 'bn' ? 'আমাদের সকল পণ্য দেখুন' : 'Explore our complete product range'}
              </p>
            </div>
          </div>
          {allProducts.length > 0 ? (
            <div className="grid-products">
              {allProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-tertiary)' }}>
              {lang === 'bn' ? 'কোনো পণ্য পাওয়া যায়নি।' : 'No products available yet.'}
            </div>
          )}
        </div>
      </section>

      {/* Features / Why Choose Us */}
      <section className="section" style={{ background: 'var(--bg-tertiary)' }} id="features-section">
        <div className="container">
          <div className="section-header" style={{ justifyContent: 'center', textAlign: 'center' }}>
            <div>
              <h2 className="section-title">{t.about.whyUs}</h2>
              <p className="section-subtitle">
                {lang === 'bn'
                  ? 'আমাদের সেবা এবং মানের প্রতিশ্রুতি'
                  : 'Our commitment to quality and service'}
              </p>
            </div>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-card-icon">🏆</div>
              <h3 className="feature-card-title">{t.about.quality}</h3>
              <p className="feature-card-desc">{t.about.qualityText}</p>
            </div>
            <div className="feature-card">
              <div className="feature-card-icon">🚚</div>
              <h3 className="feature-card-title">{t.about.delivery}</h3>
              <p className="feature-card-desc">{t.about.deliveryText}</p>
            </div>
            <div className="feature-card">
              <div className="feature-card-icon">👨‍🌾</div>
              <h3 className="feature-card-title">{t.about.support}</h3>
              <p className="feature-card-desc">{t.about.supportText}</p>
            </div>
            <div className="feature-card">
              <div className="feature-card-icon">💰</div>
              <h3 className="feature-card-title">{t.about.affordable}</h3>
              <p className="feature-card-desc">{t.about.affordableText}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section
        style={{
          background: 'linear-gradient(135deg, var(--green-800), var(--green-700))',
          padding: 'var(--space-16) 0',
          textAlign: 'center',
          color: 'white',
        }}
      >
        <div className="container">
          <h2 style={{ fontSize: 'var(--text-4xl)', fontWeight: 800, marginBottom: 'var(--space-4)', color: 'white' }}>
            {lang === 'bn' ? 'আজই আপনার অর্ডার দিন!' : 'Place Your Order Today!'}
          </h2>
          <p style={{ fontSize: 'var(--text-lg)', opacity: 0.8, marginBottom: 'var(--space-8)', maxWidth: 600, margin: '0 auto var(--space-8)' }}>
            {lang === 'bn'
              ? '৳৩,০০০+ অর্ডারে ফ্রি ডেলিভারি। সারাদেশে ৬৪ জেলায় দ্রুত ডেলিভারি।'
              : 'Free delivery on orders above ৳3,000. Fast delivery across all 64 districts.'}
          </p>
          <Link href="/products" className="hero-btn-primary" style={{ fontSize: 'var(--text-lg)' }}>
            {t.hero.cta} →
          </Link>
        </div>
      </section>
    </div>
  );
}
