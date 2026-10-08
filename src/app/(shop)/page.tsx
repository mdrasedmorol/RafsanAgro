'use client';

import React from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import { demoProducts } from '@/lib/demo-data';
import ProductCard from '@/components/shop/ProductCard';
import { ArrowRight, ShieldCheck, Truck, UserRound, DollarSign, Sparkles } from '@/components/animate-ui/icons';

export default function HomePage() {
  const { t, lang } = useI18n();
  const [productsList, setProductsList] = React.useState<any[]>(demoProducts);

  React.useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setProductsList(json.data);
        }
      })
      .catch(() => {});
  }, []);

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
            <Sparkles size={16} className="text-amber-400" animateOnHover />
            {lang === 'bn' ? 'কৃষকের অকৃত্রিম বন্ধু • আধুনিক কৃষির সারথী' : 'Farmer-First Companion • Advancing Modern Agriculture'}
          </div>

          {/* Heading — slide up with shimmer highlight */}
          <h1 className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
            {lang === 'bn' ? (
              <>
                <span className="hero-highlight inline-block bg-[length:200%_auto] animate-text-shimmer" style={{ backgroundImage: 'linear-gradient(90deg, #4BA625, #66c23a, #8dd463, #66c23a, #4BA625)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  কৃষকের পাশে অকৃত্রিম বন্ধু,
                </span>{' '}
                সমৃদ্ধির পথে আধুনিক কৃষি
              </>
            ) : (
              <>
                <span className="hero-highlight inline-block bg-[length:200%_auto] animate-text-shimmer" style={{ backgroundImage: 'linear-gradient(90deg, #4BA625, #66c23a, #8dd463, #66c23a, #4BA625)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  A Trusted Friend to Farmers,
                </span>{' '}
                Advancing Tomorrow&apos;s Agriculture
              </>
            )}
          </h1>

          {/* Subtitle — slide in from left */}
          <p className="animate-slide-in-left" style={{ animationDelay: '0.35s' }}>
            {t.hero.subtitle}
          </p>

          {/* Action buttons — staggered slide up with glow on primary */}
          <div className="hero-actions animate-slide-up" style={{ animationDelay: '0.5s' }}>
            <Link href="/products" className="hero-btn-primary animate-glow-pulse transition-all duration-300 hover:scale-105 hover:-translate-y-1 inline-flex items-center justify-center gap-2" id="hero-cta" style={{ animationDelay: '0.7s' }}>
              <span>{t.hero.cta}</span>
              <ArrowRight size={18} animateOnHover />
            </Link>
            <Link href="/blog" className="hero-btn-secondary transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 inline-flex items-center justify-center gap-2" id="hero-blog">
              <span>{t.hero.ctaSecondary}</span>
              <ArrowRight size={18} animateOnHover />
            </Link>
          </div>

          {/* Stats — staggered count-up animation */}
          <div className="hero-stats">
            <div className="hero-stat animate-count-up" style={{ animationDelay: '0.6s' }}>
              <div className="hero-stat-value">500+</div>
              <div className="hero-stat-label">{lang === 'bn' ? 'উন্নত কৃষি উপকরণ' : 'Quality Agro Inputs'}</div>
            </div>
            <div className="hero-stat animate-count-up" style={{ animationDelay: '0.75s' }}>
              <div className="hero-stat-value">10K+</div>
              <div className="hero-stat-label">{lang === 'bn' ? 'সুখী কৃষক পরিবার' : 'Farmer Families Supported'}</div>
            </div>
            <div className="hero-stat animate-count-up" style={{ animationDelay: '0.9s' }}>
              <div className="hero-stat-value">64</div>
              <div className="hero-stat-label">{lang === 'bn' ? 'জেলায় আন্তরিক সেবা' : 'Districts Reached'}</div>
            </div>
          </div>
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
      <section className="section features-section-wrap" style={{ background: 'var(--bg-tertiary)' }} id="features-section">
        {/* Animated background orbs */}
        <div className="features-bg-orb features-bg-orb--1" aria-hidden="true" />
        <div className="features-bg-orb features-bg-orb--2" aria-hidden="true" />
        <div className="features-bg-orb features-bg-orb--3" aria-hidden="true" />
        <div className="features-bg-orb features-bg-orb--4" aria-hidden="true" />
        <div className="features-bg-orb features-bg-orb--5" aria-hidden="true" />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
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
              <div className="feature-card-icon flex items-center justify-center text-emerald-600">
                <ShieldCheck size={36} animateOnHover />
              </div>
              <h3 className="feature-card-title">{t.about.quality}</h3>
              <p className="feature-card-desc">{t.about.qualityText}</p>
            </div>
            <div className="feature-card">
              <div className="feature-card-icon flex items-center justify-center text-emerald-600">
                <Truck size={36} animateOnHover />
              </div>
              <h3 className="feature-card-title">{t.about.delivery}</h3>
              <p className="feature-card-desc">{t.about.deliveryText}</p>
            </div>
            <div className="feature-card">
              <div className="feature-card-icon flex items-center justify-center text-emerald-600">
                <UserRound size={36} animateOnHover />
              </div>
              <h3 className="feature-card-title">{t.about.support}</h3>
              <p className="feature-card-desc">{t.about.supportText}</p>
            </div>
            <div className="feature-card">
              <div className="feature-card-icon flex items-center justify-center text-emerald-600">
                <DollarSign size={36} animateOnHover />
              </div>
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
          <Link href="/products" className="hero-btn-primary inline-flex items-center justify-center gap-2" style={{ fontSize: 'var(--text-lg)' }}>
            <span>{t.hero.cta}</span>
            <ArrowRight size={20} animateOnHover />
          </Link>
        </div>
      </section>
    </div>
  );
}
