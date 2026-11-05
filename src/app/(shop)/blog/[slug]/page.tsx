'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import { ArrowLeft, Calendar, Clock, User } from '@/components/animate-ui/icons';

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

export default function BlogArticlePage() {
  const { lang } = useI18n();
  const params = useParams();
  const slug = params.slug as string;

  const [article, setArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchArticle = async () => {
      setIsLoading(true);
      try {
        const res = await fetch('/api/articles?status=PUBLISHED');
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          const found = json.data.find((a: Article) => a.slug === slug);
          if (found) {
            setArticle(found);
          } else {
            setNotFound(true);
          }
        } else {
          setNotFound(true);
        }
      } catch {
        setNotFound(true);
      } finally {
        setIsLoading(false);
      }
    };
    if (slug) fetchArticle();
  }, [slug]);

  if (isLoading) {
    return (
      <div
        className="page-enter"
        style={{
          minHeight: '60vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#64748b',
          fontWeight: 600,
        }}
      >
        {lang === 'bn' ? 'লোড হচ্ছে...' : 'Loading article...'}
      </div>
    );
  }

  if (notFound || !article) {
    return (
      <div
        className="page-enter"
        style={{
          minHeight: '60vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '40px',
        }}
      >
        <div style={{ fontSize: '4rem', marginBottom: '16px' }}>📄</div>
        <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '8px' }}>
          {lang === 'bn' ? 'নিবন্ধটি পাওয়া যায়নি' : 'Article Not Found'}
        </h2>
        <p style={{ color: '#64748b', marginBottom: '20px' }}>
          {lang === 'bn'
            ? 'আপনি যে নিবন্ধটি খুঁজছেন সেটি আর উপলব্ধ নেই।'
            : 'The article you are looking for does not exist or has been removed.'}
        </p>
        <Link
          href="/blog"
          style={{
            background: 'linear-gradient(135deg, #4BA625, #3D8A1E)',
            color: '#fff',
            padding: '10px 24px',
            borderRadius: '9999px',
            fontWeight: 600,
            textDecoration: 'none',
            fontSize: '14px',
          }}
        >
          {lang === 'bn' ? '← ব্লগে ফিরে যান' : '← Back to Blog'}
        </Link>
      </div>
    );
  }

  const displayDate = article.publishedAt || article.createdAt;

  return (
    <div className="page-enter" style={{ minHeight: '80vh', paddingBottom: 'var(--space-16)' }}>
      {/* Cover Image Hero */}
      {article.coverImage && (
        <div
          style={{
            width: '100%',
            height: 'clamp(220px, 35vw, 420px)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <img
            src={article.coverImage}
            alt={article.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.6) 100%)',
            }}
          />
        </div>
      )}

      <div
        className="container"
        style={{
          maxWidth: '800px',
          margin: '0 auto',
          padding: article.coverImage
            ? 'var(--space-8) var(--container-padding) 0'
            : 'var(--space-12) var(--container-padding) 0',
        }}
      >
        {/* Back link */}
        <Link
          href="/blog"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            color: '#3D8A1E',
            fontWeight: 600,
            fontSize: 'var(--text-sm)',
            textDecoration: 'none',
            marginBottom: 'var(--space-6)',
          }}
        >
          <ArrowLeft size={16} animateOnHover />
          {lang === 'bn' ? 'সকল নিবন্ধ' : 'All Articles'}
        </Link>

        {/* Category & Date */}
        <div
          style={{
            display: 'flex',
            gap: '12px',
            alignItems: 'center',
            flexWrap: 'wrap',
            marginBottom: 'var(--space-4)',
          }}
        >
          {article.category && (
            <span
              style={{
                background: 'rgba(75, 166, 37, 0.12)',
                color: '#1B7A3D',
                padding: '4px 14px',
                borderRadius: '9999px',
                fontSize: 'var(--text-xs)',
                fontWeight: 700,
              }}
            >
              {article.category}
            </span>
          )}
          {article.isFeatured && (
            <span
              style={{
                background: 'rgba(245, 158, 11, 0.12)',
                color: '#b45309',
                padding: '4px 14px',
                borderRadius: '9999px',
                fontSize: 'var(--text-xs)',
                fontWeight: 700,
              }}
            >
              ⭐ {lang === 'bn' ? 'বিশেষ নিবন্ধ' : 'Featured'}
            </span>
          )}
        </div>

        {/* Title */}
        <h1
          style={{
            fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
            fontWeight: 900,
            lineHeight: 1.25,
            marginBottom: 'var(--space-4)',
            color: 'var(--text-primary, #0f172a)',
          }}
        >
          {article.title}
        </h1>

        {/* Meta */}
        <div
          style={{
            display: 'flex',
            gap: '16px',
            alignItems: 'center',
            fontSize: 'var(--text-sm)',
            color: 'var(--text-secondary, #64748b)',
            marginBottom: 'var(--space-6)',
            paddingBottom: 'var(--space-6)',
            borderBottom: '1px solid var(--border-light, #e2e8f0)',
            flexWrap: 'wrap',
          }}
        >
          {article.author && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              <User size={14} animateOnHover />
              {article.author}
            </span>
          )}
          {displayDate && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              <Calendar size={14} animateOnHover />
              {new Date(displayDate).toLocaleDateString(
                lang === 'bn' ? 'bn-BD' : 'en-US',
                { year: 'numeric', month: 'long', day: 'numeric' }
              )}
            </span>
          )}
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
            }}
          >
            <Clock size={14} animateOnHover />
            {Math.max(1, Math.ceil(article.content.split(/\s+/).length / 200))}{' '}
            {lang === 'bn' ? 'মিনিট পাঠ্য' : 'min read'}
          </span>
        </div>

        {/* Summary */}
        {article.summary && (
          <div
            style={{
              padding: '16px 20px',
              borderLeft: '4px solid #4BA625',
              background: 'rgba(75, 166, 37, 0.06)',
              borderRadius: '0 12px 12px 0',
              marginBottom: 'var(--space-6)',
              fontSize: 'var(--text-base)',
              fontStyle: 'italic',
              color: 'var(--text-secondary, #475569)',
              lineHeight: 1.7,
            }}
          >
            {article.summary}
          </div>
        )}

        {/* Video */}
        {article.videoUrl && (
          <div style={{ marginBottom: 'var(--space-6)' }}>
            {article.videoUrl.includes('youtube.com') || article.videoUrl.includes('youtu.be') ? (
              <iframe
                src={getYouTubeEmbedUrl(article.videoUrl)}
                title="Video"
                style={{
                  width: '100%',
                  height: 'clamp(220px, 50vw, 400px)',
                  borderRadius: '16px',
                  border: 'none',
                }}
                allowFullScreen
              />
            ) : (
              <a
                href={article.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'rgba(75, 166, 37, 0.1)',
                  color: '#3D8A1E',
                  padding: '12px 20px',
                  borderRadius: '12px',
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                🎬 {lang === 'bn' ? 'ভিডিও দেখুন' : 'Watch Video'} →
              </a>
            )}
          </div>
        )}

        {/* Article Content */}
        <div
          style={{
            fontSize: 'var(--text-base)',
            lineHeight: 1.9,
            color: 'var(--text-primary, #334155)',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}
        >
          {article.content}
        </div>

        {/* Additional Images Gallery */}
        {article.images && article.images.length > 0 && (
          <div style={{ marginTop: 'var(--space-8)' }}>
            <h3
              style={{
                fontSize: 'var(--text-lg)',
                fontWeight: 700,
                marginBottom: 'var(--space-4)',
              }}
            >
              📸 {lang === 'bn' ? 'ছবিসমূহ' : 'Gallery'}
            </h3>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '12px',
              }}
            >
              {article.images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`Image ${i + 1}`}
                  style={{
                    width: '100%',
                    height: '160px',
                    objectFit: 'cover',
                    borderRadius: '12px',
                    border: '1px solid var(--border-light, #e2e8f0)',
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                  }}
                  onClick={() => window.open(img, '_blank')}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.03)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                />
              ))}
            </div>
          </div>
        )}

        {/* Documents */}
        {article.documents && article.documents.length > 0 && (
          <div style={{ marginTop: 'var(--space-8)' }}>
            <h3
              style={{
                fontSize: 'var(--text-lg)',
                fontWeight: 700,
                marginBottom: 'var(--space-4)',
              }}
            >
              📎 {lang === 'bn' ? 'সংযুক্ত ডকুমেন্ট' : 'Attached Documents'}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {article.documents.map((doc, i) => (
                <a
                  key={i}
                  href={doc}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '12px 16px',
                    background: 'var(--bg-secondary, #f8fafc)',
                    borderRadius: '12px',
                    border: '1px solid var(--border-light, #e2e8f0)',
                    color: '#3D8A1E',
                    fontWeight: 600,
                    fontSize: 'var(--text-sm)',
                    textDecoration: 'none',
                    transition: 'border-color 0.2s',
                  }}
                >
                  📄 {lang === 'bn' ? `ডকুমেন্ট ${i + 1}` : `Document ${i + 1}`}
                  <span style={{ marginLeft: 'auto', fontSize: '12px', color: '#64748b' }}>
                    {lang === 'bn' ? 'ডাউনলোড →' : 'Download →'}
                  </span>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div
            style={{
              marginTop: 'var(--space-8)',
              display: 'flex',
              gap: '8px',
              flexWrap: 'wrap',
            }}
          >
            {article.tags.map((tag, i) => (
              <span
                key={i}
                style={{
                  background: 'var(--bg-secondary, #f1f5f9)',
                  color: 'var(--text-secondary, #64748b)',
                  padding: '5px 14px',
                  borderRadius: '9999px',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 600,
                }}
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        <div
          style={{
            marginTop: 'var(--space-10)',
            padding: 'var(--space-6)',
            background: 'linear-gradient(135deg, rgba(75, 166, 37, 0.08), rgba(61, 138, 30, 0.12))',
            borderRadius: '16px',
            textAlign: 'center',
          }}
        >
          <p
            style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--text-secondary, #475569)',
              marginBottom: 'var(--space-3)',
            }}
          >
            {lang === 'bn'
              ? 'আমাদের কৃষি পণ্য অনলাইনে অর্ডার করুন'
              : 'Order quality agricultural products online'}
          </p>
          <Link
            href="/products"
            style={{
              display: 'inline-block',
              background: 'linear-gradient(135deg, #4BA625, #3D8A1E)',
              color: '#fff',
              padding: '10px 28px',
              borderRadius: '9999px',
              fontWeight: 700,
              textDecoration: 'none',
              fontSize: 'var(--text-sm)',
            }}
          >
            {lang === 'bn' ? 'পণ্য দেখুন →' : 'Browse Products →'}
          </Link>
        </div>
      </div>
    </div>
  );
}

