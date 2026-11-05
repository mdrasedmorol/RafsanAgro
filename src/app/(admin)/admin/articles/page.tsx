'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  FiPlus,
  FiSearch,
  FiEdit2,
  FiTrash2,
  FiEye,
  FiX,
  FiCheck,
  FiUploadCloud,
  FiImage,
  FiStar,
} from '@/components/animate-ui/icons';

// ========== Types ==========
interface Article {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  coverImage: string | null;
  images: string[];
  videoUrl: string | null;
  documents: string[];
  category: string | null;
  tags: string[];
  author: string | null;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  isFeatured: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

const ARTICLE_CATEGORIES = [
  'Soil & Fertilizer',
  'Crop Protection',
  'Seeds & Propagation',
  'Modern Farming',
  'Market & Pricing',
  'Technology',
  'News & Updates',
  'General',
];

const STATUS_COLORS: Record<string, string> = {
  DRAFT: 'status-pending',
  PUBLISHED: 'status-delivered',
  ARCHIVED: 'status-cancelled',
};

// ========== Component ==========
export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewArticle, setPreviewArticle] = useState<Article | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    summary: '',
    content: '',
    coverImage: '' as string | null,
    images: [] as string[],
    videoUrl: '',
    documents: [] as string[],
    category: 'General',
    tags: '',
    author: '',
    status: 'DRAFT' as 'DRAFT' | 'PUBLISHED' | 'ARCHIVED',
    isFeatured: false,
  });

  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // ========== Fetch ==========
  const fetchArticles = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/articles');
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setArticles(json.data);
      }
    } catch (err) {
      console.warn('Failed to fetch articles:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  // ========== Filtering ==========
  const filteredArticles = useMemo(() => {
    return articles.filter((a) => {
      const matchStatus = statusFilter === 'ALL' || a.status === statusFilter;
      const matchCategory =
        categoryFilter === 'ALL' || a.category === categoryFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        a.title.toLowerCase().includes(q) ||
        (a.summary || '').toLowerCase().includes(q) ||
        (a.author || '').toLowerCase().includes(q);
      return matchStatus && matchCategory && matchSearch;
    });
  }, [articles, statusFilter, categoryFilter, searchQuery]);

  // ========== File Upload ==========
  const uploadFile = async (file: File, folder: string): Promise<string | null> => {
    setIsUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('folder', folder);
      const res = await fetch('/api/articles/upload', { method: 'POST', body: fd });
      const json = await res.json();
      if (json.success) return json.url;
      showToast('Upload failed: ' + json.error);
      return null;
    } catch (err) {
      showToast('Upload error');
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await uploadFile(file, 'articles/covers');
    if (url) setFormData((p) => ({ ...p, coverImage: url }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    for (let i = 0; i < files.length; i++) {
      const url = await uploadFile(files[i], 'articles/images');
      if (url) setFormData((p) => ({ ...p, images: [...p.images, url] }));
    }
  };

  const handleDocUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    for (let i = 0; i < files.length; i++) {
      const url = await uploadFile(files[i], 'articles/documents');
      if (url) setFormData((p) => ({ ...p, documents: [...p.documents, url] }));
    }
  };

  const removeImage = (idx: number) => {
    setFormData((p) => ({
      ...p,
      images: p.images.filter((_, i) => i !== idx),
    }));
  };

  const removeDoc = (idx: number) => {
    setFormData((p) => ({
      ...p,
      documents: p.documents.filter((_, i) => i !== idx),
    }));
  };

  // ========== CRUD ==========
  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      summary: '',
      content: '',
      coverImage: null,
      images: [],
      videoUrl: '',
      documents: [],
      category: 'General',
      tags: '',
      author: '',
      status: 'DRAFT',
      isFeatured: false,
    });
    setEditingArticle(null);
  };

  const openCreate = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEdit = (article: Article) => {
    setEditingArticle(article);
    setFormData({
      title: article.title,
      slug: article.slug,
      summary: article.summary || '',
      content: article.content,
      coverImage: article.coverImage,
      images: article.images || [],
      videoUrl: article.videoUrl || '',
      documents: article.documents || [],
      category: article.category || 'General',
      tags: (article.tags || []).join(', '),
      author: article.author || '',
      status: article.status,
      isFeatured: article.isFeatured,
    });
    setIsModalOpen(true);
  };

  const openPreview = (article: Article) => {
    setPreviewArticle(article);
    setIsPreviewOpen(true);
  };

  const handleSave = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      showToast('Title and content are required!');
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        ...formData,
        tags: formData.tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
      };

      if (editingArticle) {
        // Update
        const res = await fetch('/api/articles', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingArticle.id, ...payload }),
        });
        const json = await res.json();
        if (json.success) {
          showToast('Article updated successfully!');
          setIsModalOpen(false);
          resetForm();
          fetchArticles();
        } else {
          showToast('Update failed: ' + json.error);
        }
      } else {
        // Create
        const res = await fetch('/api/articles', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const json = await res.json();
        if (json.success) {
          showToast('Article created successfully!');
          setIsModalOpen(false);
          resetForm();
          fetchArticles();
        } else {
          showToast('Create failed: ' + json.error);
        }
      }
    } catch (err) {
      showToast('Error saving article');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return;
    try {
      const res = await fetch(`/api/articles?id=${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        showToast('Article deleted');
        fetchArticles();
      }
    } catch (err) {
      showToast('Delete failed');
    }
  };

  const handleToggleStatus = async (article: Article) => {
    const newStatus = article.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
    try {
      const res = await fetch('/api/articles', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: article.id, status: newStatus }),
      });
      const json = await res.json();
      if (json.success) {
        showToast(
          newStatus === 'PUBLISHED' ? 'Article published!' : 'Article unpublished'
        );
        fetchArticles();
      }
    } catch (err) {
      showToast('Status update failed');
    }
  };

  // ========== Render ==========
  return (
    <div className="admin-dashboard-wrapper">
      {/* Toast */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            background: '#10b981',
            color: '#fff',
            padding: '12px 24px',
            borderRadius: '12px',
            fontWeight: 600,
            fontSize: '14px',
            zIndex: 99999,
            boxShadow: '0 8px 24px rgba(16, 185, 129, 0.3)',
            animation: 'fadeIn 0.3s ease',
          }}
        >
          {toastMessage}
        </div>
      )}

      {/* Page Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Blog Articles</h1>
          <p className="admin-page-header-subtitle">
            Create, edit and publish blog articles for your website
          </p>
        </div>
        <div className="admin-page-actions">
          <button className="btn btn-primary" onClick={openCreate}>
            <FiPlus size={16} /> New Article
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '24px',
          alignItems: 'center',
        }}
      >
        {/* Search */}
        <div style={{ position: 'relative', flex: '1 1 260px', maxWidth: '400px' }}>
          <FiSearch
            size={16}
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#94a3b8',
              pointerEvents: 'none',
            }}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search articles..."
            className="admin-search-input"
            style={{ paddingLeft: '38px' }}
          />
        </div>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="admin-select"
        >
          <option value="ALL">All Status</option>
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
          <option value="ARCHIVED">Archived</option>
        </select>

        {/* Category Filter */}
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="admin-select"
        >
          <option value="ALL">All Categories</option>
          {ARTICLE_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <span
          style={{
            fontSize: '13px',
            color: '#64748b',
            fontWeight: 500,
            marginLeft: 'auto',
          }}
        >
          {filteredArticles.length} article{filteredArticles.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Articles Table */}
      <div className="chart-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="admin-table-container">
          {isLoading ? (
            <div style={{ padding: '60px', textAlign: 'center', color: '#64748b' }}>
              Loading articles...
            </div>
          ) : filteredArticles.length === 0 ? (
            <div style={{ padding: '60px', textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '12px' }}>📝</div>
              <h3
                style={{
                  fontSize: '18px',
                  fontWeight: 700,
                  marginBottom: '8px',
                  color: '#0f172a',
                }}
              >
                No articles found
              </h3>
              <p style={{ color: '#64748b', marginBottom: '16px' }}>
                {articles.length === 0
                  ? 'Start by creating your first blog article'
                  : 'Try adjusting your filters or search query'}
              </p>
              {articles.length === 0 && (
                <button className="btn btn-primary" onClick={openCreate}>
                  <FiPlus size={16} /> Create First Article
                </button>
              )}
            </div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th style={{ width: '40px' }}></th>
                  <th>Article</th>
                  <th>Category</th>
                  <th>Author</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th style={{ width: '140px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredArticles.map((article) => (
                  <tr key={article.id}>
                    <td>
                      {article.coverImage ? (
                        <img
                          src={article.coverImage}
                          alt=""
                          style={{
                            width: '36px',
                            height: '36px',
                            objectFit: 'cover',
                            borderRadius: '8px',
                            border: '1px solid #e2e8f0',
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '8px',
                            background: '#f0f9e8',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '16px',
                          }}
                        >
                          📄
                        </div>
                      )}
                    </td>
                    <td>
                      <div
                        style={{
                          fontWeight: 700,
                          fontSize: '14px',
                          marginBottom: '2px',
                          maxWidth: '300px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {article.isFeatured && (
                          <FiStar
                            size={12}
                            style={{
                              color: '#f59e0b',
                              marginRight: '4px',
                              verticalAlign: 'middle',
                            }}
                          />
                        )}
                        {article.title}
                      </div>
                      {article.summary && (
                        <div
                          style={{
                            fontSize: '12px',
                            color: '#94a3b8',
                            maxWidth: '300px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {article.summary}
                        </div>
                      )}
                    </td>
                    <td>
                      <span
                        style={{
                          fontSize: '12px',
                          background: '#f0f9e8',
                          color: '#3D8A1E',
                          padding: '3px 10px',
                          borderRadius: '9999px',
                          fontWeight: 600,
                        }}
                      >
                        {article.category || '—'}
                      </span>
                    </td>
                    <td style={{ fontSize: '13px', color: '#64748b' }}>
                      {article.author || '—'}
                    </td>
                    <td>
                      <button
                        onClick={() => handleToggleStatus(article)}
                        className={`status-badge ${STATUS_COLORS[article.status] || ''}`}
                        style={{
                          cursor: 'pointer',
                          border: 'none',
                          background: 'inherit',
                          fontWeight: 600,
                          fontSize: '12px',
                        }}
                        title="Click to toggle status"
                      >
                        <span className="status-dot" />
                        {article.status}
                      </button>
                    </td>
                    <td style={{ fontSize: '12px', color: '#94a3b8' }}>
                      {article.createdAt
                        ? new Date(article.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })
                        : '—'}
                    </td>
                    <td>
                      <div
                        style={{
                          display: 'flex',
                          gap: '6px',
                          justifyContent: 'flex-end',
                        }}
                      >
                        <button
                          onClick={() => openPreview(article)}
                          className="btn-icon"
                          title="Preview"
                          style={iconBtnStyle}
                        >
                          <FiEye size={14} />
                        </button>
                        <button
                          onClick={() => openEdit(article)}
                          className="btn-icon"
                          title="Edit"
                          style={iconBtnStyle}
                        >
                          <FiEdit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(article.id)}
                          className="btn-icon"
                          title="Delete"
                          style={{ ...iconBtnStyle, color: '#ef4444' }}
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* ========== Create / Edit Modal ========== */}
      {isModalOpen && (
        <div className="admin-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div
            className="admin-modal"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '820px', maxHeight: '92vh', overflowY: 'auto' }}
          >
            {/* Modal Header */}
            <div className="admin-modal-header">
              <h2 style={{ fontSize: '20px', fontWeight: 800 }}>
                {editingArticle ? 'Edit Article' : 'Create New Article'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#64748b',
                  padding: '6px',
                }}
              >
                <FiX size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Title */}
              <div className="form-group">
                <label className="form-label">
                  Title <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.title}
                  onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
                  placeholder="Article title (any language)..."
                />
              </div>

              {/* Slug */}
              <div className="form-group">
                <label className="form-label">
                  Slug{' '}
                  <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 400 }}>
                    (auto-generated if empty)
                  </span>
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.slug}
                  onChange={(e) => setFormData((p) => ({ ...p, slug: e.target.value }))}
                  placeholder="article-url-slug"
                />
              </div>

              {/* Row: Category, Author, Status */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    className="form-input"
                    value={formData.category}
                    onChange={(e) => setFormData((p) => ({ ...p, category: e.target.value }))}
                  >
                    {ARTICLE_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Author</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.author}
                    onChange={(e) => setFormData((p) => ({ ...p, author: e.target.value }))}
                    placeholder="Author name"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select
                    className="form-input"
                    value={formData.status}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        status: e.target.value as 'DRAFT' | 'PUBLISHED' | 'ARCHIVED',
                      }))
                    }
                  >
                    <option value="DRAFT">Draft</option>
                    <option value="PUBLISHED">Published</option>
                    <option value="ARCHIVED">Archived</option>
                  </select>
                </div>
              </div>

              {/* Tags + Featured */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '16px', alignItems: 'end' }}>
                <div className="form-group">
                  <label className="form-label">Tags (comma-separated)</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.tags}
                    onChange={(e) => setFormData((p) => ({ ...p, tags: e.target.value }))}
                    placeholder="e.g. farming, fertilizer, monsoon"
                  />
                </div>
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: formData.isFeatured ? '#f59e0b' : '#64748b',
                    paddingBottom: '10px',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, isFeatured: e.target.checked }))
                    }
                  />
                  <FiStar size={14} /> Featured
                </label>
              </div>

              {/* Summary */}
              <div className="form-group">
                <label className="form-label">Summary</label>
                <textarea
                  className="form-input"
                  value={formData.summary}
                  onChange={(e) => setFormData((p) => ({ ...p, summary: e.target.value }))}
                  placeholder="Brief summary of the article..."
                  rows={3}
                  style={{ resize: 'vertical' }}
                />
              </div>

              {/* Content */}
              <div className="form-group">
                <label className="form-label">
                  Content <span style={{ color: '#ef4444' }}>*</span>
                  <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 400, marginLeft: '8px' }}>
                    Supports any language. Use blank lines for paragraphs.
                  </span>
                </label>
                <textarea
                  className="form-input"
                  value={formData.content}
                  onChange={(e) => setFormData((p) => ({ ...p, content: e.target.value }))}
                  placeholder="Write your article content here... (any language is supported)"
                  rows={12}
                  style={{ resize: 'vertical', lineHeight: '1.7', fontFamily: 'inherit' }}
                />
              </div>

              {/* Video URL */}
              <div className="form-group">
                <label className="form-label">🎬 Video Link (YouTube / external)</label>
                <input
                  type="url"
                  className="form-input"
                  value={formData.videoUrl}
                  onChange={(e) => setFormData((p) => ({ ...p, videoUrl: e.target.value }))}
                  placeholder="https://www.youtube.com/watch?v=..."
                />
              </div>

              {/* Cover Image */}
              <div className="form-group">
                <label className="form-label">🖼️ Cover Image</label>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                  {formData.coverImage && (
                    <div style={{ position: 'relative' }}>
                      <img
                        src={formData.coverImage}
                        alt="Cover"
                        style={{
                          width: '120px',
                          height: '80px',
                          objectFit: 'cover',
                          borderRadius: '10px',
                          border: '2px solid #e2e8f0',
                        }}
                      />
                      <button
                        onClick={() => setFormData((p) => ({ ...p, coverImage: null }))}
                        style={{
                          position: 'absolute',
                          top: '-6px',
                          right: '-6px',
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          background: '#ef4444',
                          color: '#fff',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '10px',
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  )}
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '10px 16px',
                      borderRadius: '10px',
                      border: '2px dashed #cbd5e1',
                      cursor: 'pointer',
                      color: '#64748b',
                      fontSize: '13px',
                      fontWeight: 600,
                      transition: 'border-color 0.2s',
                    }}
                  >
                    <FiUploadCloud size={16} />
                    {isUploading ? 'Uploading...' : 'Upload Cover'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCoverUpload}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>
              </div>

              {/* Additional Images */}
              <div className="form-group">
                <label className="form-label">📸 Additional Images</label>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                  {formData.images.map((img, idx) => (
                    <div key={idx} style={{ position: 'relative' }}>
                      <img
                        src={img}
                        alt=""
                        style={{
                          width: '80px',
                          height: '60px',
                          objectFit: 'cover',
                          borderRadius: '8px',
                          border: '1px solid #e2e8f0',
                        }}
                      />
                      <button
                        onClick={() => removeImage(idx)}
                        style={{
                          position: 'absolute',
                          top: '-4px',
                          right: '-4px',
                          width: '18px',
                          height: '18px',
                          borderRadius: '50%',
                          background: '#ef4444',
                          color: '#fff',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '9px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 14px',
                      borderRadius: '8px',
                      border: '2px dashed #cbd5e1',
                      cursor: 'pointer',
                      color: '#64748b',
                      fontSize: '12px',
                      fontWeight: 600,
                    }}
                  >
                    <FiImage size={14} />
                    {isUploading ? 'Uploading...' : 'Add Images'}
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>
              </div>

              {/* Documents */}
              <div className="form-group">
                <label className="form-label">📎 Documents (PDF, DOC, etc.)</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {formData.documents.map((doc, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '8px 12px',
                        background: '#f8fafc',
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0',
                        fontSize: '13px',
                      }}
                    >
                      <a
                        href={doc}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: '#3D8A1E', fontWeight: 500, textDecoration: 'underline' }}
                      >
                        📄 Document {idx + 1}
                      </a>
                      <button
                        onClick={() => removeDoc(idx)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#ef4444',
                          cursor: 'pointer',
                          fontWeight: 700,
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  <label
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 14px',
                      borderRadius: '8px',
                      border: '2px dashed #cbd5e1',
                      cursor: 'pointer',
                      color: '#64748b',
                      fontSize: '12px',
                      fontWeight: 600,
                      alignSelf: 'flex-start',
                    }}
                  >
                    <FiUploadCloud size={14} />
                    {isUploading ? 'Uploading...' : 'Upload Documents'}
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv"
                      multiple
                      onChange={handleDocUpload}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div
              style={{
                padding: '16px 24px',
                borderTop: '1px solid #e2e8f0',
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '12px',
                background: '#f8fafc',
                borderRadius: '0 0 16px 16px',
              }}
            >
              <button
                className="btn btn-secondary"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              {!editingArticle && (
                <button
                  className="btn"
                  style={{
                    background: '#64748b',
                    color: '#fff',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '10px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    setFormData((p) => ({ ...p, status: 'DRAFT' }));
                    setTimeout(handleSave, 0);
                  }}
                  disabled={isSaving}
                >
                  Save Draft
                </button>
              )}
              <button
                className="btn btn-primary"
                onClick={() => {
                  if (!editingArticle) {
                    setFormData((p) => ({ ...p, status: 'PUBLISHED' }));
                    setTimeout(handleSave, 0);
                  } else {
                    handleSave();
                  }
                }}
                disabled={isSaving}
              >
                <FiCheck size={16} />
                {isSaving
                  ? 'Saving...'
                  : editingArticle
                  ? 'Update Article'
                  : 'Publish Article'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========== Preview Modal ========== */}
      {isPreviewOpen && previewArticle && (
        <div className="admin-modal-overlay" onClick={() => setIsPreviewOpen(false)}>
          <div
            className="admin-modal"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '720px', maxHeight: '90vh', overflowY: 'auto' }}
          >
            <div className="admin-modal-header">
              <h2 style={{ fontSize: '18px', fontWeight: 800 }}>Article Preview</h2>
              <button
                onClick={() => setIsPreviewOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#64748b',
                  padding: '6px',
                }}
              >
                <FiX size={20} />
              </button>
            </div>
            <div style={{ padding: '24px' }}>
              {previewArticle.coverImage && (
                <img
                  src={previewArticle.coverImage}
                  alt={previewArticle.title}
                  style={{
                    width: '100%',
                    height: '240px',
                    objectFit: 'cover',
                    borderRadius: '12px',
                    marginBottom: '20px',
                  }}
                />
              )}

              <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
                {previewArticle.category && (
                  <span
                    style={{
                      background: '#f0f9e8',
                      color: '#3D8A1E',
                      padding: '4px 12px',
                      borderRadius: '9999px',
                      fontSize: '12px',
                      fontWeight: 700,
                    }}
                  >
                    {previewArticle.category}
                  </span>
                )}
                <span
                  className={`status-badge ${STATUS_COLORS[previewArticle.status]}`}
                  style={{ fontSize: '12px' }}
                >
                  <span className="status-dot" />
                  {previewArticle.status}
                </span>
              </div>

              <h1
                style={{
                  fontSize: '24px',
                  fontWeight: 800,
                  lineHeight: 1.3,
                  marginBottom: '12px',
                }}
              >
                {previewArticle.title}
              </h1>

              {previewArticle.author && (
                <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '8px' }}>
                  By {previewArticle.author}
                  {previewArticle.publishedAt &&
                    ` • ${new Date(previewArticle.publishedAt).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}`}
                </p>
              )}

              {previewArticle.summary && (
                <p
                  style={{
                    fontSize: '15px',
                    color: '#475569',
                    fontStyle: 'italic',
                    marginBottom: '16px',
                    padding: '12px 16px',
                    borderLeft: '4px solid #4BA625',
                    background: '#f0f9e8',
                    borderRadius: '0 8px 8px 0',
                  }}
                >
                  {previewArticle.summary}
                </p>
              )}

              {/* Video */}
              {previewArticle.videoUrl && (
                <div style={{ marginBottom: '16px' }}>
                  {previewArticle.videoUrl.includes('youtube.com') ||
                  previewArticle.videoUrl.includes('youtu.be') ? (
                    <iframe
                      src={getYouTubeEmbedUrl(previewArticle.videoUrl)}
                      title="Video"
                      style={{
                        width: '100%',
                        height: '360px',
                        borderRadius: '12px',
                        border: 'none',
                      }}
                      allowFullScreen
                    />
                  ) : (
                    <a
                      href={previewArticle.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: '#3D8A1E', fontWeight: 600 }}
                    >
                      🎬 Watch Video →
                    </a>
                  )}
                </div>
              )}

              {/* Content */}
              <div
                style={{
                  fontSize: '15px',
                  lineHeight: 1.8,
                  color: '#334155',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {previewArticle.content}
              </div>

              {/* Additional Images */}
              {previewArticle.images && previewArticle.images.length > 0 && (
                <div style={{ marginTop: '20px' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '12px' }}>
                    📸 Images
                  </h4>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {previewArticle.images.map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        alt=""
                        style={{
                          width: '140px',
                          height: '100px',
                          objectFit: 'cover',
                          borderRadius: '10px',
                          border: '1px solid #e2e8f0',
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Documents */}
              {previewArticle.documents && previewArticle.documents.length > 0 && (
                <div style={{ marginTop: '20px' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '8px' }}>
                    📎 Attached Documents
                  </h4>
                  {previewArticle.documents.map((doc, i) => (
                    <a
                      key={i}
                      href={doc}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'block',
                        padding: '8px 12px',
                        background: '#f8fafc',
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0',
                        marginBottom: '6px',
                        color: '#3D8A1E',
                        fontWeight: 500,
                        fontSize: '13px',
                        textDecoration: 'none',
                      }}
                    >
                      📄 Document {i + 1}
                    </a>
                  ))}
                </div>
              )}

              {/* Tags */}
              {previewArticle.tags && previewArticle.tags.length > 0 && (
                <div style={{ marginTop: '20px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {previewArticle.tags.map((tag, i) => (
                    <span
                      key={i}
                      style={{
                        background: '#f1f5f9',
                        color: '#64748b',
                        padding: '3px 10px',
                        borderRadius: '9999px',
                        fontSize: '11px',
                        fontWeight: 600,
                      }}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ========== Helpers ==========
const iconBtnStyle: React.CSSProperties = {
  background: 'none',
  border: '1px solid #e2e8f0',
  borderRadius: '8px',
  width: '32px',
  height: '32px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  color: '#64748b',
  transition: 'all 0.15s ease',
};

function getYouTubeEmbedUrl(url: string): string {
  try {
    const u = new URL(url);
    if (u.hostname.includes('youtu.be')) {
      return `https://www.youtube.com/embed${u.pathname}`;
    }
    const v = u.searchParams.get('v');
    if (v) return `https://www.youtube.com/embed/${v}`;
    return url;
  } catch {
    return url;
  }
}

