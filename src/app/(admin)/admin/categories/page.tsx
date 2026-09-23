'use client';

import React, { useState } from 'react';
import { demoCategories as initialCategories, DemoCategory } from '@/lib/demo-data';
import { FiPlus, FiEdit2, FiTrash2, FiFolder, FiCheckCircle, FiX } from 'react-icons/fi';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<DemoCategory[]>(initialCategories);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<DemoCategory | null>(null);
  const [formData, setFormData] = useState({
    nameEn: '',
    nameBn: '',
    slug: '',
    description: '',
    icon: '🌱',
  });
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setFormData({ nameEn: '', nameBn: '', slug: '', description: '', icon: '🌱' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat: DemoCategory) => {
    setEditingCategory(cat);
    setFormData({
      nameEn: cat.nameEn,
      nameBn: cat.nameBn,
      slug: cat.slug,
      description: cat.description,
      icon: cat.icon || '🌱',
    });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nameEn) return;

    if (editingCategory) {
      setCategories(
        categories.map((c) =>
          c.id === editingCategory.id ? { ...c, ...formData } : c
        )
      );
      showToast('Category updated!');
    } else {
      const newCat: DemoCategory = {
        id: `cat-custom-${Date.now()}`,
        nameEn: formData.nameEn,
        nameBn: formData.nameBn || formData.nameEn,
        slug: formData.slug || formData.nameEn.toLowerCase().replace(/\s+/g, '-'),
        description: formData.description || '',
        image: '/images/categories/placeholder.jpg',
        icon: formData.icon || '🌱',
        productCount: 0,
      };
      setCategories([...categories, newCat]);
      showToast('Category added!');
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this category?')) {
      setCategories(categories.filter((c) => c.id !== id));
      showToast('Category removed.');
    }
  };

  return (
    <div className="admin-page-container">
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

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-primary-dark)' }}>
            Category Taxonomy
          </h1>
          <p style={{ color: 'var(--color-slate-500)', fontSize: '0.9rem', marginTop: '4px' }}>
            Organize agricultural products into distinct categories and sub-types
          </p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenAdd} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FiPlus /> Add Category
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {categories.map((cat) => (
          <div key={cat.id} className="admin-card" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-lg)', background: 'var(--color-slate-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0 }}>
                {cat.icon}
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-primary-dark)' }}>
                  {cat.nameEn}
                </h3>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-accent-emerald)', fontWeight: 600 }}>
                  {cat.nameBn}
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-slate-500)', marginTop: '4px' }}>
                  {cat.description}
                </p>
                <div style={{ marginTop: '10px', fontSize: '0.75rem', fontWeight: 700, background: '#e0e7ff', color: '#3730a3', padding: '2px 8px', borderRadius: '12px', display: 'inline-block' }}>
                  {cat.productCount} Products
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '6px' }}>
              <button onClick={() => handleOpenEdit(cat)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--color-slate-500)' }}>
                <FiEdit2 size={16} />
              </button>
              <button onClick={() => handleDelete(cat.id)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#dc2626' }}>
                <FiTrash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, padding: '20px' }}>
          <div style={{ background: '#fff', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-xl)', width: '100%', maxWidth: '480px', overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', background: 'var(--color-primary-dark)', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
                <FiX size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} style={{ padding: '24px' }}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-slate-700)', marginBottom: '6px' }}>
                  English Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Seeds"
                  value={formData.nameEn}
                  onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-slate-300)', fontSize: '0.9rem' }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-slate-700)', marginBottom: '6px' }}>
                  Bengali Name (বাংলা নাম)
                </label>
                <input
                  type="text"
                  placeholder="e.g. বীজ"
                  value={formData.nameBn}
                  onChange={(e) => setFormData({ ...formData, nameBn: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-slate-300)', fontSize: '0.9rem' }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-slate-700)', marginBottom: '6px' }}>
                  Category Emoji Icon
                </label>
                <input
                  type="text"
                  placeholder="e.g. 🌱"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-slate-300)', fontSize: '0.9rem' }}
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-slate-700)', marginBottom: '6px' }}>
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Short description..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-slate-300)', fontSize: '0.875rem' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
