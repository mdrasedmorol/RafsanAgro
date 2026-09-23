'use client';

import React, { useState, useMemo } from 'react';
import { demoProducts as initialProducts, demoCategories, DemoProduct } from '@/lib/demo-data';
import { formatCurrency } from '@/lib/utils';
import {
  FiPlus,
  FiSearch,
  FiEdit2,
  FiTrash2,
  FiEye,
  FiPackage,
  FiCheckCircle,
  FiAlertTriangle,
  FiXCircle,
  FiStar,
  FiX,
  FiCheck,
} from 'react-icons/fi';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<DemoProduct[]>(initialProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [stockFilter, setStockFilter] = useState('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<DemoProduct | null>(null);
  const [formData, setFormData] = useState<Partial<DemoProduct>>({
    nameEn: '',
    nameBn: '',
    categoryId: demoCategories[0]?.id || 'cat-1',
    price: 0,
    discountPrice: undefined,
    stock: 10,
    unit: 'piece',
    sku: '',
    brand: '',
    descriptionEn: '',
    descriptionBn: '',
    images: ['/images/products/placeholder.jpg'],
    isFeatured: false,
    isActive: true,
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category filter
      if (categoryFilter !== 'ALL' && p.categoryId !== categoryFilter) return false;
      // Stock filter
      if (stockFilter === 'IN_STOCK' && p.stock <= 0) return false;
      if (stockFilter === 'LOW_STOCK' && (p.stock > 20 || p.stock === 0)) return false;
      if (stockFilter === 'OUT_OF_STOCK' && p.stock > 0) return false;
      // Search
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesName = p.nameEn.toLowerCase().includes(q) || p.nameBn.toLowerCase().includes(q);
        const matchesSku = p.sku.toLowerCase().includes(q);
        if (!matchesName && !matchesSku) return false;
      }
      return true;
    });
  }, [products, categoryFilter, stockFilter, searchQuery]);

  // Statistics
  const totalProducts = products.length;
  const activeProducts = products.filter((p) => p.isActive).length;
  const lowStockCount = products.filter((p) => p.stock > 0 && p.stock <= 20).length;
  const outOfStockCount = products.filter((p) => p.stock === 0).length;

  // Open Add Modal
  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormData({
      nameEn: '',
      nameBn: '',
      categoryId: demoCategories[0]?.id || 'cat-1',
      price: 100,
      discountPrice: undefined,
      stock: 50,
      unit: 'piece',
      sku: `PROD-${Date.now().toString().slice(-4)}`,
      brand: 'Rafsan Agro',
      descriptionEn: '',
      descriptionBn: '',
      images: ['/images/products/rice-seed.jpg'],
      isFeatured: false,
      isActive: true,
    });
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (p: DemoProduct) => {
    setEditingProduct(p);
    setFormData({ ...p });
    setIsModalOpen(true);
  };

  // Handle Save
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nameEn || !formData.price) return;

    const selectedCat = demoCategories.find((c) => c.id === formData.categoryId);

    if (editingProduct) {
      // Update
      const updated = products.map((p) =>
        p.id === editingProduct.id
          ? {
              ...p,
              ...formData,
              categoryName: selectedCat?.nameEn || p.categoryName,
              categorySlug: selectedCat?.slug || p.categorySlug,
            } as DemoProduct
          : p
      );
      setProducts(updated);
      showToast('Product updated successfully!');
    } else {
      // Add
      const newProduct: DemoProduct = {
        id: `prod-custom-${Date.now()}`,
        nameEn: formData.nameEn || 'New Product',
        nameBn: formData.nameBn || formData.nameEn || 'নতুন পণ্য',
        slug: (formData.nameEn || 'new-product').toLowerCase().replace(/\s+/g, '-'),
        descriptionEn: formData.descriptionEn || '',
        descriptionBn: formData.descriptionBn || '',
        price: Number(formData.price),
        discountPrice: formData.discountPrice ? Number(formData.discountPrice) : undefined,
        stock: Number(formData.stock || 0),
        sku: formData.sku || `SKU-${Date.now().toString().slice(-4)}`,
        unit: formData.unit || 'piece',
        categoryId: formData.categoryId || 'cat-1',
        categoryName: selectedCat?.nameEn || 'General',
        categorySlug: selectedCat?.slug || 'general',
        images: formData.images || ['/images/products/rice-seed.jpg'],
        isFeatured: Boolean(formData.isFeatured),
        isActive: Boolean(formData.isActive),
        brand: formData.brand || 'Rafsan Agro',
        tags: ['agricultural'],
      };
      setProducts([newProduct, ...products]);
      showToast('New product added successfully!');
    }
    setIsModalOpen(false);
  };

  // Toggle Active
  const handleToggleActive = (id: string) => {
    setProducts(
      products.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p))
    );
  };

  // Toggle Featured
  const handleToggleFeatured = (id: string) => {
    setProducts(
      products.map((p) => (p.id === id ? { ...p, isFeatured: !p.isFeatured } : p))
    );
  };

  // Delete
  const handleDeleteProduct = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter((p) => p.id !== id));
      showToast('Product deleted.');
    }
  };

  return (
    <div className="admin-page-container">
      {/* Toast */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          background: 'var(--color-primary-dark)',
          color: '#fff',
          padding: '12px 24px',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-xl)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontWeight: 600,
        }}>
          <FiCheckCircle size={20} color="var(--color-accent-amber)" />
          {toastMessage}
        </div>
      )}

      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-primary-dark)' }}>
            Product Catalog Management
          </h1>
          <p style={{ color: 'var(--color-slate-500)', fontSize: '0.9rem', marginTop: '4px' }}>
            Add, update inventory, manage pricing, and set featured agricultural products
          </p>
        </div>

        <button className="btn btn-primary" onClick={handleOpenAddModal} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FiPlus size={18} /> Add New Product
        </button>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid" style={{ marginBottom: '28px' }}>
        <div className="kpi-card">
          <div className="kpi-card-header">
            <span className="kpi-card-title">Total Products</span>
            <div className="kpi-card-icon" style={{ background: '#e0e7ff', color: '#4f46e5' }}>
              <FiPackage size={20} />
            </div>
          </div>
          <div className="kpi-card-value">{totalProducts}</div>
          <div className="kpi-card-trend kpi-trend-up">{activeProducts} Active Listing</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-card-header">
            <span className="kpi-card-title">Active Items</span>
            <div className="kpi-card-icon" style={{ background: '#d1fae5', color: '#059669' }}>
              <FiCheckCircle size={20} />
            </div>
          </div>
          <div className="kpi-card-value">{activeProducts}</div>
          <div className="kpi-card-trend kpi-trend-up">Visible on Storefront</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-card-header">
            <span className="kpi-card-title">Low Stock Alert</span>
            <div className="kpi-card-icon" style={{ background: '#fef3c7', color: '#d97706' }}>
              <FiAlertTriangle size={20} />
            </div>
          </div>
          <div className="kpi-card-value" style={{ color: lowStockCount > 0 ? '#d97706' : 'inherit' }}>
            {lowStockCount}
          </div>
          <div className="kpi-card-trend kpi-trend-down">Stock &le; 20 units</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-card-header">
            <span className="kpi-card-title">Out of Stock</span>
            <div className="kpi-card-icon" style={{ background: '#fee2e2', color: '#dc2626' }}>
              <FiXCircle size={20} />
            </div>
          </div>
          <div className="kpi-card-value" style={{ color: outOfStockCount > 0 ? '#dc2626' : 'inherit' }}>
            {outOfStockCount}
          </div>
          <div className="kpi-card-trend kpi-trend-down">Action Required</div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="admin-card">
        {/* Table Toolbar */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--color-slate-200)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          {/* Search */}
          <div style={{ position: 'relative' }}>
            <FiSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-slate-400)' }} />
            <input
              type="text"
              placeholder="Search product name or SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px 9px 36px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-slate-300)',
                fontSize: '0.875rem',
              }}
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-slate-300)',
                fontSize: '0.875rem',
                background: '#fff',
              }}
            >
              <option value="ALL">All Categories</option>
              {demoCategories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nameEn} ({c.nameBn})
                </option>
              ))}
            </select>
          </div>

          {/* Stock Filter */}
          <div>
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-slate-300)',
                fontSize: '0.875rem',
                background: '#fff',
              }}
            >
              <option value="ALL">All Stock Levels</option>
              <option value="IN_STOCK">In Stock (&gt; 0)</option>
              <option value="LOW_STOCK">Low Stock (&le; 20)</option>
              <option value="OUT_OF_STOCK">Out of Stock (0)</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th style={{ textAlign: 'center' }}>Featured</th>
                <th style={{ textAlign: 'center' }}>Status</th>
                <th style={{ textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: 'var(--color-slate-500)' }}>
                    No products found matching your search.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const isLow = p.stock > 0 && p.stock <= 20;
                  const isOut = p.stock === 0;

                  return (
                    <tr key={p.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div
                            style={{
                              width: '44px',
                              height: '44px',
                              borderRadius: 'var(--radius-md)',
                              background: '#f1f5f9',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '1.2rem',
                              fontWeight: 700,
                              color: 'var(--color-primary-dark)',
                              flexShrink: 0,
                            }}
                          >
                            🌱
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, color: 'var(--color-primary-dark)', fontSize: '0.9rem' }}>
                              {p.nameEn}
                            </div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--color-slate-500)' }}>
                              {p.nameBn} • <span style={{ fontFamily: 'monospace' }}>{p.sku}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-slate-700)' }}>
                          {p.categoryName}
                        </span>
                      </td>
                      <td>
                        <div>
                          <span style={{ fontWeight: 700, color: 'var(--color-primary-dark)' }}>
                            {formatCurrency(p.discountPrice || p.price)}
                          </span>
                          {p.discountPrice && (
                            <span style={{ fontSize: '0.75rem', textDecoration: 'line-through', color: 'var(--color-slate-400)', marginLeft: '6px' }}>
                              {formatCurrency(p.price)}
                            </span>
                          )}
                          <div style={{ fontSize: '0.75rem', color: 'var(--color-slate-500)' }}>per {p.unit}</div>
                        </div>
                      </td>
                      <td>
                        <span
                          style={{
                            padding: '4px 10px',
                            borderRadius: 'var(--radius-full)',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            background: isOut ? '#fee2e2' : isLow ? '#fef3c7' : '#d1fae5',
                            color: isOut ? '#991b1b' : isLow ? '#92400e' : '#065f46',
                          }}
                        >
                          {isOut ? 'Out of Stock' : `${p.stock} in stock`}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <button
                          onClick={() => handleToggleFeatured(p.id)}
                          style={{
                            border: 'none',
                            background: 'none',
                            cursor: 'pointer',
                            color: p.isFeatured ? '#f59e0b' : 'var(--color-slate-300)',
                            fontSize: '1.2rem',
                          }}
                          title={p.isFeatured ? 'Remove Featured' : 'Make Featured'}
                        >
                          <FiStar />
                        </button>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <button
                          onClick={() => handleToggleActive(p.id)}
                          style={{
                            padding: '4px 12px',
                            borderRadius: 'var(--radius-full)',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            border: 'none',
                            cursor: 'pointer',
                            background: p.isActive ? '#d1fae5' : '#e2e8f0',
                            color: p.isActive ? '#065f46' : '#64748b',
                          }}
                        >
                          {p.isActive ? 'Active' : 'Draft'}
                        </button>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                          <button
                            onClick={() => handleOpenEditModal(p)}
                            style={{
                              border: 'none',
                              background: 'var(--color-slate-100)',
                              color: 'var(--color-slate-700)',
                              padding: '6px',
                              borderRadius: '4px',
                              cursor: 'pointer',
                            }}
                            title="Edit"
                          >
                            <FiEdit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            style={{
                              border: 'none',
                              background: '#fee2e2',
                              color: '#dc2626',
                              padding: '6px',
                              borderRadius: '4px',
                              cursor: 'pointer',
                            }}
                            title="Delete"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999,
            padding: '20px',
          }}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: 'var(--radius-xl)',
              boxShadow: 'var(--shadow-xl)',
              width: '100%',
              maxWidth: '680px',
              maxHeight: '90vh',
              overflowY: 'auto',
              animation: 'scaleUp 0.25s ease',
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '20px 24px',
                background: 'var(--color-primary-dark)',
                color: '#fff',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>
                {editingProduct ? 'Edit Product' : 'Add New Agricultural Product'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}
              >
                <FiX size={24} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveProduct} style={{ padding: '24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-slate-700)', marginBottom: '6px' }}>
                    English Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. BARI Rice Seed 5kg"
                    value={formData.nameEn}
                    onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--color-slate-300)',
                      fontSize: '0.9rem',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-slate-700)', marginBottom: '6px' }}>
                    Bengali Name (বাংলা নাম)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. বারি ধান বীজ ৫ কেজি"
                    value={formData.nameBn}
                    onChange={(e) => setFormData({ ...formData, nameBn: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--color-slate-300)',
                      fontSize: '0.9rem',
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-slate-700)', marginBottom: '6px' }}>
                    Category *
                  </label>
                  <select
                    required
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--color-slate-300)',
                      fontSize: '0.9rem',
                    }}
                  >
                    {demoCategories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nameEn} ({c.nameBn})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-slate-700)', marginBottom: '6px' }}>
                    SKU Code
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. SEED-001"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--color-slate-300)',
                      fontSize: '0.9rem',
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-slate-700)', marginBottom: '6px' }}>
                    Regular Price (৳) *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="1000"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--color-slate-300)',
                      fontSize: '0.9rem',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-slate-700)', marginBottom: '6px' }}>
                    Discount Price (৳)
                  </label>
                  <input
                    type="number"
                    placeholder="Optional"
                    value={formData.discountPrice || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        discountPrice: e.target.value ? Number(e.target.value) : undefined,
                      })
                    }
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--color-slate-300)',
                      fontSize: '0.9rem',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-slate-700)', marginBottom: '6px' }}>
                    Stock Qty *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="50"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--color-slate-300)',
                      fontSize: '0.9rem',
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-slate-700)', marginBottom: '6px' }}>
                    Unit (piece, bag, kg, set)
                  </label>
                  <input
                    type="text"
                    placeholder="bag"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--color-slate-300)',
                      fontSize: '0.9rem',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-slate-700)', marginBottom: '6px' }}>
                    Brand / Manufacturer
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. BARI, IFFCO, Lal Teer"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--color-slate-300)',
                      fontSize: '0.9rem',
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-slate-700)', marginBottom: '6px' }}>
                  English Description
                </label>
                <textarea
                  rows={2}
                  value={formData.descriptionEn}
                  onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-slate-300)',
                    fontSize: '0.875rem',
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '24px', marginBottom: '24px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 600 }}>
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  />
                  Active (Visible on shop)
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 600 }}>
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  />
                  Featured Product (Homepage slider)
                </label>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingProduct ? 'Update Product' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
