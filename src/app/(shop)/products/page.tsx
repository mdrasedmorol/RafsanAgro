'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useI18n } from '@/lib/i18n';
import { demoProducts, demoCategories } from '@/lib/demo-data';
import ProductCard from '@/components/shop/ProductCard';
import { Search } from '@/components/animate-ui/icons';

function ProductsContent() {
  const { t, lang } = useI18n();
  const searchParams = useSearchParams();
  const categoryFilter = searchParams.get('category');

  const [productsList, setProductsList] = useState<any[]>(demoProducts);
  const [categoriesList, setCategoriesList] = useState<any[]>(demoCategories);

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(categoryFilter || '');
  const [sortBy, setSortBy] = useState('newest');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/categories'),
        ]);
        const prodData = await prodRes.json();
        const catData = await catRes.json();
        if (prodData.success && Array.isArray(prodData.data) && prodData.data.length > 0) {
          setProductsList(prodData.data);
        }
        if (catData.success && Array.isArray(catData.data) && catData.data.length > 0) {
          setCategoriesList(catData.data);
        }
      } catch (err) {}
    };
    fetchData();
  }, []);

  const filteredProducts = useMemo(() => {
    let products = productsList.filter((p) => p.isActive);

    // Search
    if (search) {
      const q = search.toLowerCase();
      products = products.filter(
        (p) =>
          p.nameEn.toLowerCase().includes(q) ||
          p.nameBn.includes(search) ||
          (p.tags && p.tags.some((tag: string) => tag.includes(q)))
      );
    }

    // Category
    if (selectedCategory) {
      products = products.filter((p) => p.categorySlug === selectedCategory || p.categoryId === selectedCategory);
    }

    // Price
    products = products.filter((p) => {
      const price = p.discountPrice ?? p.price;
      return price >= priceRange[0] && price <= priceRange[1];
    });

    // Sort
    switch (sortBy) {
      case 'price-asc':
        products.sort((a, b) => (a.discountPrice ?? a.price) - (b.discountPrice ?? b.price));
        break;
      case 'price-desc':
        products.sort((a, b) => (b.discountPrice ?? b.price) - (a.discountPrice ?? a.price));
        break;
      case 'name':
        products.sort((a, b) => a.nameEn.localeCompare(b.nameEn));
        break;
      default:
        break;
    }

    return products;
  }, [productsList, search, selectedCategory, sortBy, priceRange]);

  return (
    <div className="page-enter" style={{ minHeight: '80vh' }}>
      <div className="container" style={{ padding: 'var(--space-10) var(--container-padding)' }}>
        {/* Page Header */}
        <div style={{ marginBottom: 'var(--space-8)' }}>
          <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, marginBottom: 'var(--space-2)' }}>
            {t.common.allProducts}
          </h1>
          <p className="text-muted">
            {lang === 'bn'
              ? `${filteredProducts.length}টি পণ্য পাওয়া গেছে`
              : `${filteredProducts.length} products found`}
          </p>
        </div>

        {/* Filters Bar */}
        <div
          style={{
            display: 'flex',
            gap: 'var(--space-4)',
            marginBottom: 'var(--space-8)',
            flexWrap: 'wrap',
            alignItems: 'center',
          }}
        >
          {/* Search */}
          <div style={{ flex: 1, minWidth: 250, position: 'relative' }}>
            <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-tertiary)' }}>
              <Search size={18} animateOnHover />
            </div>
            <input
              type="text"
              className="input"
              placeholder={t.common.search}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              id="product-search"
              style={{ width: '100%', paddingLeft: '38px' }}
            />
          </div>

          {/* Category Filter */}
          <select
            className="select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            id="category-filter"
          >
            <option value="">{lang === 'bn' ? 'সব ক্যাটাগরি' : 'All Categories'}</option>
            {categoriesList.map((cat) => (
              <option key={cat.id} value={cat.slug || cat.id}>
                {lang === 'bn' ? cat.nameBn : cat.nameEn}
              </option>
            ))}
          </select>

          {/* Sort */}
          <select
            className="select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            id="sort-filter"
          >
            <option value="newest">{t.product.newest}</option>
            <option value="price-asc">{t.product.priceLowHigh}</option>
            <option value="price-desc">{t.product.priceHighLow}</option>
            <option value="name">{t.product.nameAZ}</option>
          </select>

          {/* Price Range */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <span className="text-sm text-muted">৳</span>
            <input
              type="number"
              className="input"
              placeholder="Min"
              style={{ width: 80 }}
              value={priceRange[0] || ''}
              onChange={(e) => setPriceRange([Number(e.target.value) || 0, priceRange[1]])}
            />
            <span className="text-muted">-</span>
            <input
              type="number"
              className="input"
              placeholder="Max"
              style={{ width: 80 }}
              value={priceRange[1] === 10000 ? '' : priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value) || 10000])}
            />
          </div>
        </div>

        {/* Category Chips */}
        <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-6)', flexWrap: 'wrap' }}>
          <button
            className={`btn ${selectedCategory === '' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ borderRadius: 'var(--radius-full)' }}
            onClick={() => setSelectedCategory('')}
          >
            {lang === 'bn' ? 'সব' : 'All'}
          </button>
          {categoriesList.map((cat) => (
            <button
              key={cat.id}
              className={`btn ${selectedCategory === (cat.slug || cat.id) ? 'btn-primary' : 'btn-secondary'}`}
              style={{ borderRadius: 'var(--radius-full)' }}
              onClick={() => setSelectedCategory(cat.slug || cat.id)}
            >
              {cat.icon || '🌱'} {lang === 'bn' ? cat.nameBn : cat.nameEn}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid-products">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon flex justify-center items-center py-4">
              <Search size={54} className="text-gray-400" animateOnHover />
            </div>
            <h3 className="empty-state-title">{t.common.noResults}</h3>
            <p className="empty-state-text">
              {lang === 'bn'
                ? 'আপনার অনুসন্ধান পরিবর্তন করে আবার চেষ্টা করুন'
                : 'Try adjusting your search or filter criteria'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div style={{ padding: '60px', textAlign: 'center', fontWeight: 600 }}>Loading products...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
