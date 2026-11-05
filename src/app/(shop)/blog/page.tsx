'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import { Search, X, Calendar, Clock, User, ArrowRight } from '@/components/animate-ui/icons';

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
  status: string;
  isFeatured: boolean;
  publishedAt: string | null;
  createdAt: string;
}

// Gradient mapping for categories
const CATEGORY_GRADIENTS: Record<string, string> = {
  'Soil & Fertilizer': 'linear-gradient(135deg, rgba(75, 166, 37, 0.15), rgba(27, 122, 61, 0.25))',
  'Crop Protection': 'linear-gradient(135deg, rgba(234, 179, 8, 0.15), rgba(202, 138, 4, 0.25))',
  'Seeds & Propagation': 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(37, 99, 235, 0.25))',
  'Modern Farming': 'linear-gradient(135deg, rgba(20, 184, 166, 0.15), rgba(13, 148, 136, 0.25))',
  'Market & Pricing': 'linear-gradient(135deg, rgba(168, 85, 247, 0.15), rgba(139, 92, 246, 0.25))',
  'Technology': 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(79, 70, 229, 0.25))',
  'News & Updates': 'linear-gradient(135deg, rgba(244, 63, 94, 0.15), rgba(225, 29, 72, 0.25))',
  'General': 'linear-gradient(135deg, rgba(100, 116, 139, 0.15), rgba(71, 85, 105, 0.25))',
};

const CATEGORY_ICONS: Record<string, string> = {
  'Soil & Fertilizer': '🌱',
  'Crop Protection': '🛡️',
  'Seeds & Propagation': '🌾',
  'Modern Farming': '💧',
  'Market & Pricing': '📊',
  'Technology': '💻',
  'News & Updates': '📰',
  'General': '📝',
};

export default function BlogPage() {
  const { lang } = useI18n();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch published articles from the database
  useEffect(() => {
    const fetchArticles = async () => {
      setIsLoading(true);
      try {
        const res = await fetch('/api/articles?status=PUBLISHED');
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setArticles(json.data);
        }
      } catch (err) {
        console.warn('Failed to fetch articles:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchArticles();
  }, []);

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = new Set(articles.map((a) => a.category).filter(Boolean));
    return ['all', ...Array.from(cats)] as string[];
  }, [articles]);

  const filteredPosts = useMemo(() => {
    return articles.filter((post) => {
      const matchesCategory =
        selectedCategory === 'all' || post.category === selectedCategory;
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        post.title.toLowerCase().includes(query) ||
        (post.summary || '').toLowerCase().includes(query) ||
        (post.author || '').toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery, articles]);

  return (
    <div className="page-enter" style={{ minHeight: '80vh', paddingBottom: 'var(--space-16)' }}>
      {/* Hero Section */}
      <section
        style={{
          background: 'linear-gradient(135deg, #1B7A3D 0%, #3D8A1E 50%, #4BA625 100%)',
          color: '#ffffff',
          padding: 'var(--space-16) 0 var(--space-12)',
          position: 'relative',
          overflow: 'hidden',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '-50px',
            right: '-50px',
            width: '280px',
            height: '280px',
            background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)',
            borderRadius: '50%',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-60px',
            left: '-40px',
            width: '320px',
            height: '320px',
            background: 'radial-gradient(circle, rgba(251,191,36,0.22) 0%, transparent 70%)',
            borderRadius: '50%',
            pointerEvents: 'none',
          }}
        />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(255, 255, 255, 0.18)',
              backdropFilter: 'blur(8px)',
              padding: '6px 16px',
              borderRadius: '9999px',
              fontSize: 'var(--text-sm)',
              fontWeight: 600,
              marginBottom: 'var(--space-4)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
            }}
          >
            🌾 {lang === 'bn' ? 'রফসান এগ্রো কৃষি পরামর্শ' : 'Rafsan Agro Knowledge Hub'}
          </span>
          <h1
            style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 900,
              lineHeight: 1.2,
              marginBottom: 'var(--space-4)',
              color: '#ffffff',
              textShadow: '0 2px 10px rgba(0,0,0,0.15)',
            }}
          >
            {lang === 'bn'
              ? 'কৃষি বিষয়ক পরামর্শ, প্রযুক্তি ও ব্লগ'
              : 'Agricultural Insights, Tips & Modern Guides'}
          </h1>
          <p
            style={{
              fontSize: 'var(--text-lg)',
              maxWidth: '680px',
              margin: '0 auto var(--space-8)',
              opacity: 0.92,
              lineHeight: 'var(--leading-relaxed)',
            }}
          >
            {lang === 'bn'
              ? 'ফলন বৃদ্ধি, মাটি পরিচর্যা, বালাইনাশক ও আধুনিক চাষাবাদের বিশ্বস্ত সমাধান ও বিশেষজ্ঞদের পরামর্শ।'
              : 'Expert farming advice, sustainable soil care, crop protection strategies, and updates from the fields.'}
          </p>

          {/* Search Box */}
          <div
            style={{
              maxWidth: '520px',
              margin: '0 auto',
              position: 'relative',
            }}
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                lang === 'bn' ? 'আর্টিকেল বা বিষয় অনুসন্ধান করুন...' : 'Search articles, topics or keywords...'
              }
              style={{
                width: '100%',
                padding: '14px 20px 14px 44px',
                borderRadius: '9999px',
                border: '2px solid rgba(255, 255, 255, 0.4)',
                background: 'rgba(255, 255, 255, 0.95)',
                color: '#1a4a0e',
                fontSize: 'var(--text-base)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                outline: 'none',
              }}
            />
            <span
              style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#1a4a0e',
                opacity: 0.7,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Search size={18} animateOnHover />
            </span>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute',
                  right: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#666',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <X size={16} animateOnHover />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="container" style={{ padding: 'var(--space-8) var(--container-padding)' }}>
        {/* Category Pills */}
        {categories.length > 1 && (
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '10px',
              marginBottom: 'var(--space-8)',
              justifyContent: 'center',
            }}
          >
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    padding: '8px 18px',
                    borderRadius: '9999px',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    border: isSelected
                      ? '1px solid #3D8A1E'
                      : '1px solid var(--border-light, #e2e8f0)',
                    background: isSelected
                      ? 'linear-gradient(135deg, #4BA625, #3D8A1E)'
                      : 'var(--bg-secondary, #ffffff)',
                    color: isSelected ? '#ffffff' : 'var(--text-secondary, #475569)',
                    boxShadow: isSelected ? '0 4px 12px rgba(75, 166, 37, 0.25)' : 'none',
                  }}
                >
                  {cat === 'all'
                    ? lang === 'bn'
                      ? 'সকল নিবন্ধ'
                      : 'All Articles'
                    : cat}
                </button>
              );
            })}
          </div>
        )}

        {/* Results Count */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 'var(--space-6)',
            fontSize: 'var(--text-sm)',
            color: 'var(--text-secondary, #64748b)',
          }}
        >
          <span>
            {isLoading
              ? lang === 'bn'
                ? 'লোড হচ্ছে...'
                : 'Loading...'
              : lang === 'bn'
              ? `${filteredPosts.length} টি নিবন্ধ পাওয়া গেছে`
              : `Showing ${filteredPosts.length} article${filteredPosts.length !== 1 ? 's' : ''}`}
          </span>
          <Link
            href="/products"
            style={{
              color: '#3D8A1E',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              textDecoration: 'none',
            }}
          >
            {lang === 'bn' ? 'কৃষি পণ্য দেখুন →' : 'Explore Agro Products →'}
          </Link>
        </div>

        {/* Blog Post Grid */}
        {isLoading ? (
          <div
            style={{
              textAlign: 'center',
              padding: 'var(--space-16) 0',
              color: '#64748b',
              fontWeight: 600,
            }}
          >
            {lang === 'bn' ? 'নিবন্ধ লোড হচ্ছে...' : 'Loading articles...'}
          </div>
        ) : filteredPosts.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: 'var(--space-16) 0',
              background: 'var(--bg-secondary, #ffffff)',
              borderRadius: 'var(--radius-xl, 16px)',
              border: '1px dashed var(--border-light, #cbd5e1)',
            }}
          >
            <div style={{ fontSize: '3rem', marginBottom: 'var(--space-3)' }}>🌱</div>
            <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, marginBottom: 'var(--space-2)' }}>
              {lang === 'bn' ? 'কোন নিবন্ধ পাওয়া যায়নি' : 'No articles found'}
            </h3>
            <p style={{ color: 'var(--text-secondary, #64748b)', marginBottom: 'var(--space-4)' }}>
              {lang === 'bn'
                ? articles.length === 0
                  ? 'শীঘ্রই নিবন্ধ প্রকাশিত হবে।'
                  : 'অন্য কোনো শব্দ দিয়ে অনুসন্ধান করুন বা ফিল্টার পরিবর্তন করুন।'
                : articles.length === 0
                ? 'Articles will be published soon. Stay tuned!'
                : 'Try searching with different keywords or selecting another category.'}
            </p>
            {articles.length > 0 && (
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                }}
                className="btn btn-secondary"
              >
                {lang === 'bn' ? 'সব দেখুন' : 'Reset Filters'}
              </button>
            )}
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: 'var(--space-6)',
            }}
          >
            {filteredPosts.map((post) => {
              const gradient =
                CATEGORY_GRADIENTS[post.category || ''] || CATEGORY_GRADIENTS['General'];
              const icon = CATEGORY_ICONS[post.category || ''] || '📝';
              const displayDate = post.publishedAt || post.createdAt;
              const readTime = Math.max(1, Math.ceil(post.content.split(/\s+/).length / 200));

              return (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <article
                    style={{
                      background: 'var(--bg-secondary, #ffffff)',
                      borderRadius: 'var(--radius-xl, 16px)',
                      border: '1px solid var(--border-light, #e2e8f0)',
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                      cursor: 'pointer',
                      boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
                      height: '100%',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = '0 12px 28px rgba(75, 166, 37, 0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.04)';
                    }}
                  >
                    {/* Cover or gradient header */}
                    {post.coverImage ? (
                      <div
                        style={{
                          height: '180px',
                          overflow: 'hidden',
                          position: 'relative',
                        }}
                      >
                        <img
                          src={post.coverImage}
                          alt={post.title}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                          }}
                        />
                        <div
                          style={{
                            position: 'absolute',
                            top: '12px',
                            left: '12px',
                            background: 'rgba(255,255,255,0.9)',
                            backdropFilter: 'blur(4px)',
                            padding: '4px 12px',
                            borderRadius: '9999px',
                            fontSize: 'var(--text-xs)',
                            fontWeight: 700,
                            color: '#1B7A3D',
                          }}
                        >
                          {post.category || 'Article'}
                        </div>
                      </div>
                    ) : (
                      <div
                        style={{
                          background: gradient,
                          padding: 'var(--space-6)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          borderBottom: '1px solid rgba(0,0,0,0.05)',
                        }}
                      >
                        <span
                          style={{
                            background: 'rgba(255,255,255,0.85)',
                            backdropFilter: 'blur(4px)',
                            padding: '4px 12px',
                            borderRadius: '9999px',
                            fontSize: 'var(--text-xs)',
                            fontWeight: 700,
                            color: '#1B7A3D',
                          }}
                        >
                          {post.category || 'Article'}
                        </span>
                        <span style={{ fontSize: '1.75rem' }}>{icon}</span>
                      </div>
                    )}

                    {/* Article Body */}
                    <div
                      style={{
                        padding: 'var(--space-6)',
                        display: 'flex',
                        flexDirection: 'column',
                        flexGrow: 1,
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          gap: '8px',
                          alignItems: 'center',
                          fontSize: 'var(--text-xs)',
                          color: 'var(--text-tertiary, #94a3b8)',
                          marginBottom: 'var(--space-3)',
                        }}
                      >
                        <span className="inline-flex items-center gap-1">
                          <Calendar size={13} animateOnHover />
                          {displayDate
                            ? new Date(displayDate).toLocaleDateString(
                                lang === 'bn' ? 'bn-BD' : 'en-US',
                                { month: 'short', day: 'numeric', year: 'numeric' }
                              )
                            : ''}
                        </span>
                        <span>•</span>
                        <span className="inline-flex items-center gap-1">
                          <Clock size={13} animateOnHover />
                          {readTime} {lang === 'bn' ? 'মিনিট পাঠ্য' : 'min read'}
                        </span>
                      </div>

                      <h2
                        style={{
                          fontSize: 'var(--text-lg)',
                          fontWeight: 800,
                          lineHeight: 1.4,
                          marginBottom: 'var(--space-3)',
                          color: 'var(--text-primary, #0f172a)',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {post.title}
                      </h2>

                      <p
                        style={{
                          fontSize: 'var(--text-sm)',
                          color: 'var(--text-secondary, #475569)',
                          lineHeight: 'var(--leading-relaxed)',
                          marginBottom: 'var(--space-6)',
                          flexGrow: 1,
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {post.summary || post.content.substring(0, 150) + '...'}
                      </p>

                      <div
                        style={{
                          borderTop: '1px solid var(--border-light, #f1f5f9)',
                          paddingTop: 'var(--space-4)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <span
                          style={{
                            fontSize: 'var(--text-xs)',
                            color: 'var(--text-secondary, #64748b)',
                            fontWeight: 500,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          <User size={12} animateOnHover />
                          {post.author || (lang === 'bn' ? 'রফসান এগ্রো' : 'Rafsan Agro')}
                        </span>
                        <span
                          style={{
                            fontSize: 'var(--text-sm)',
                            fontWeight: 700,
                            color: '#4BA625',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          <span>{lang === 'bn' ? 'বিস্তারিত পড়ুন' : 'Read Article'}</span>
                          <ArrowRight size={14} animateOnHover />
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
