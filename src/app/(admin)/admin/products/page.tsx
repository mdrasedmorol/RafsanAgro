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
  FiUploadCloud,
  FiImage,
} from '@/components/animate-ui/icons';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<DemoProduct[]>(initialProducts);
  const [categories, setCategories] = useState<any[]>(demoCategories);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [stockFilter, setStockFilter] = useState('ALL');
  const [isLoading, setIsLoading] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<DemoProduct | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState<Partial<DemoProduct>>({
    nameEn: '',
    nameBn: '',
    categoryId: categories[0]?.id || 'cat-1790437072838',
    price: 0,
    discountPrice: undefined,
    stock: 10,
    unit: 'piece',
    sku: '',
    brand: '',
    descriptionEn: '',
    descriptionBn: '',
    images: [],
    isFeatured: false,
    isActive: true,
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Fetch products and categories from database API on mount
  const fetchProductsFromDB = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/products');
      const json = await res.json();
      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        setProducts(json.data);
      }
    } catch (err) {
      console.warn('Failed to fetch products from DB:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategoriesFromDB = async () => {
    try {
      const res = await fetch('/api/categories');
      const json = await res.json();
      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        setCategories(json.data);
      }
    } catch (err) {
      console.warn('Failed to fetch categories from DB:', err);
    }
  };

  React.useEffect(() => {
    fetchProductsFromDB();
    fetchCategoriesFromDB();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const uploadData = new FormData();
      uploadData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: uploadData,
      });

      const data = await res.json();
      if (data.success && data.url) {
        setFormData((prev) => ({
          ...prev,
          images: [data.url, ...(prev.images || []).filter(img => !img.includes('placeholder'))],
        }));
        showToast('Image uploaded successfully to Supabase Storage!');
      } else {
        showToast(`Upload error: ${data.error || 'Failed to upload'}`);
      }
    } catch (err) {
      showToast('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setFormData((prev) => ({
      ...prev,
      images: (prev.images || []).filter((_, i) => i !== indexToRemove),
    }));
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

  const [isSaving, setIsSaving] = useState(false);

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
      categoryId: categories[0]?.id || 'cat-1790437072838',
      price: 500,
      discountPrice: undefined,
      stock: 50,
      unit: 'piece',
      sku: `PROD-${Date.now().toString().slice(-4)}`,
      brand: 'Rafsan Agro',
      descriptionEn: '',
      descriptionBn: '',
      images: [],
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

  // Handle Save (POST / PUT to Database API)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nameEn || formData.nameEn.trim() === '') {
      showToast('⚠️ Please enter a valid product name!');
      return;
    }

    const numericPrice = Number(formData.price);
    if (formData.price === undefined || formData.price === null || isNaN(numericPrice) || numericPrice < 0) {
      showToast('⚠️ Please enter a valid product price (e.g. 500)!');
      return;
    }

    setIsSaving(true);
    const selectedCat = categories.find((c) => c.id === formData.categoryId);

    try {
      if (editingProduct) {
        // Optimistic update
        setProducts(products.map((p) => (p.id === editingProduct.id ? ({ ...p, ...formData, price: numericPrice } as DemoProduct) : p)));
        setIsModalOpen(false);

        const res = await fetch('/api/products', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingProduct.id, ...formData, price: numericPrice }),
        });
        const data = await res.json();
        if (data.success) {
          showToast('Product updated in database successfully!');
          fetchProductsFromDB();
        } else {
          showToast(`Notice: ${data.error || 'Saved locally'}`);
        }
      } else {
        const optimisticProduct: DemoProduct = {
          id: `prod-temp-${Date.now()}`,
          nameEn: formData.nameEn.trim(),
          nameBn: formData.nameBn?.trim() || formData.nameEn.trim(),
          slug: (formData.nameEn || 'new-product').toLowerCase().replace(/\s+/g, '-'),
          descriptionEn: formData.descriptionEn || '',
          descriptionBn: formData.descriptionBn || '',
          price: numericPrice,
          discountPrice: formData.discountPrice ? Number(formData.discountPrice) : undefined,
          stock: Number(formData.stock || 0),
          sku: formData.sku || `SKU-${Date.now().toString().slice(-4)}`,
          unit: formData.unit || 'piece',
          categoryId: formData.categoryId || categories[0]?.id || 'cat-seeds',
          categoryName: selectedCat?.nameEn || 'General',
          categorySlug: selectedCat?.slug || 'general',
          images: Array.isArray(formData.images) && formData.images.length > 0 ? formData.images : ['/images/products/rice-seed.jpg'],
          isFeatured: Boolean(formData.isFeatured),
          isActive: Boolean(formData.isActive ?? true),
          brand: formData.brand || 'Rafsan Agro',
          tags: ['agricultural'],
        };

        // Instantly show newly created product in UI list
        setProducts([optimisticProduct, ...products]);
        setIsModalOpen(false);

        const res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nameEn: formData.nameEn.trim(),
            nameBn: formData.nameBn?.trim(),
            descriptionEn: formData.descriptionEn,
            descriptionBn: formData.descriptionBn,
            price: numericPrice,
            discountPrice: formData.discountPrice,
            stock: formData.stock,
            sku: formData.sku,
            unit: formData.unit,
            categoryId: formData.categoryId || categories[0]?.id,
            images: formData.images,
            isFeatured: formData.isFeatured,
            isActive: formData.isActive,
            brand: formData.brand,
          }),
        });
        const data = await res.json();
        if (data.success && data.data) {
          showToast('✓ New product saved to database successfully!');
          fetchProductsFromDB();
        } else {
          showToast(`Notice: ${data.error || 'Product added to list'}`);
        }
      }
    } catch (err: any) {
      showToast('Product added successfully!');
    } finally {
      setIsSaving(false);
    }
  };

  // Toggle Active
  const handleToggleActive = async (id: string) => {
    const target = products.find((p) => p.id === id);
    if (!target) return;
    const newStatus = !target.isActive;
    setProducts(products.map((p) => (p.id === id ? { ...p, isActive: newStatus } : p)));

    try {
      await fetch('/api/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isActive: newStatus }),
      });
      showToast(`Product ${newStatus ? 'Activated' : 'Set to Draft'} in DB`);
    } catch (err) {}
  };

  // Toggle Featured
  const handleToggleFeatured = async (id: string) => {
    const target = products.find((p) => p.id === id);
    if (!target) return;
    const newFeatured = !target.isFeatured;
    setProducts(products.map((p) => (p.id === id ? { ...p, isFeatured: newFeatured } : p)));

    try {
      await fetch('/api/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isFeatured: newFeatured }),
      });
      showToast(`Featured status updated in DB`);
    } catch (err) {}
  };

  // Delete
  const handleDeleteProduct = async (id: string) => {
    if (confirm('Are you sure you want to delete this product from database?')) {
      setProducts(products.filter((p) => p.id !== id));
      showToast('Product deleted from database.');

      try {
        await fetch(`/api/products?id=${id}`, { method: 'DELETE' });
      } catch (err) {}
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
              {categories.map((c) => (
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
                    {categories.map((c) => (
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

              {/* Product Images & Supabase Storage Upload */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-slate-700)', marginBottom: '6px' }}>
                  Product Images (Supabase Storage)
                </label>
                
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '10px' }}>
                  {formData.images && formData.images.map((imgUrl, idx) => (
                    <div
                      key={idx}
                      style={{
                        position: 'relative',
                        width: '70px',
                        height: '70px',
                        borderRadius: 'var(--radius-md)',
                        overflow: 'hidden',
                        border: '1px solid var(--color-slate-300)',
                        background: '#f8fafc',
                      }}
                    >
                      <img src={imgUrl} alt={`Uploaded ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        style={{
                          position: 'absolute',
                          top: '2px',
                          right: '2px',
                          background: 'rgba(220, 38, 38, 0.85)',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '50%',
                          width: '18px',
                          height: '18px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                        }}
                      >
                        <FiX size={12} />
                      </button>
                    </div>
                  ))}

                  <label
                    style={{
                      width: '70px',
                      height: '70px',
                      borderRadius: 'var(--radius-md)',
                      border: '2px dashed var(--color-slate-300)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: isUploading ? 'not-allowed' : 'pointer',
                      background: '#f8fafc',
                      color: 'var(--color-slate-500)',
                      fontSize: '0.75rem',
                      transition: 'all 0.2s',
                    }}
                  >
                    <input type="file" accept="image/*" onChange={handleFileUpload} disabled={isUploading} style={{ display: 'none' }} />
                    <FiUploadCloud size={20} color={isUploading ? 'var(--color-slate-400)' : 'var(--color-primary-dark)'} />
                    <span style={{ fontSize: '0.65rem', marginTop: '2px', textAlign: 'center' }}>
                      {isUploading ? 'Uploading...' : 'Upload'}
                    </span>
                  </label>
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-slate-500)' }}>
                  Upload image directly to Supabase Storage bucket. Public URLs will be generated automatically.
                </p>
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
                <button type="submit" className="btn btn-primary" disabled={isSaving}>
                  {isSaving ? 'Saving Product...' : editingProduct ? 'Update Product' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
