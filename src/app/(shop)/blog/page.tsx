'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import { Search, X, Calendar, Clock, User, ArrowRight } from '@/components/animate-ui/icons';

interface BlogPost {
  id: string;
  category: {
    en: string;
    bn: string;
  };
  title: {
    en: string;
    bn: string;
  };
  summary: {
    en: string;
    bn: string;
  };
  content: {
    en: string;
    bn: string;
  };
  date: {
    en: string;
    bn: string;
  };
  readTime: {
    en: string;
    bn: string;
  };
  author: {
    en: string;
    bn: string;
  };
  icon: string;
  gradient: string;
}

const BLOG_POSTS: BlogPost[] = [
  {
    id: 'organic-fertilizer-guide',
    category: { en: 'Soil & Fertilizer', bn: 'সার ও মাটি' },
    title: {
      en: 'Maximizing Crop Yield with Organic Fertilizers & Vermicompost',
      bn: 'জৈব সার ও ভার্মিকম্পোস্ট ব্যবহারে ফসলের ফলন বৃদ্ধির কৌশল',
    },
    summary: {
      en: 'Learn how to balance soil micro-nutrients using balanced organic manure, improving moisture retention and microbial activity for higher returns.',
      bn: 'মাটির উর্বরতা ও অণুজীবের ভারসাম্য বজায় রেখে কীভাবে ভার্মিকম্পোস্ট ও জৈব সারের সুষম প্রয়োগে ফলন বাড়ানো যায় তার পূর্ণাঙ্গ নির্দেশিকা।',
    },
    content: {
      en: 'Organic fertilizers improve soil structure and enhance water retention capacity. Unlike chemical inputs alone, high-grade vermicompost introduces beneficial micro-flora that activate dormant nutrients. Apply 300-500 kg per acre during land preparation to establish deep root aeration and long-term soil health.',
      bn: 'জৈব সার মাটির গঠন উন্নত করে এবং জল ধারণ ক্ষমতা বহুগুণ বাড়ায়। শুধু রাসায়নিক সারের উপর নির্ভর না করে সঠিক মাত্রায় কেঁচো সার বা ভার্মিকম্পোস্ট দিলে মাটির উপকারী জীবাণু সক্রিয় হয়। জমি তৈরির সময় একর প্রতি ৩০০-৫০০ কেজি জৈব সার প্রয়োগ করলে শিকড়ের বিস্তার সহজ হয়।',
    },
    date: { en: 'October 5, 2026', bn: '৫ অক্টোবর, ২০২৬' },
    readTime: { en: '4 min read', bn: '৪ মিনিট পাঠ্য' },
    author: { en: 'Dr. M. Rahman (Agronomist)', bn: 'ড. এম. রহমান (কৃষিবিদ)' },
    icon: '🌱',
    gradient: 'linear-gradient(135deg, rgba(75, 166, 37, 0.15), rgba(27, 122, 61, 0.25))',
  },
  {
    id: 'pest-management-monsoon',
    category: { en: 'Crop Protection', bn: 'বালাইনাশক ও ফসল সুরক্ষা' },
    title: {
      en: 'Integrated Pest Management (IPM) for High-Rain Seasons',
      bn: 'বর্ষা মৌসুমে সমন্বিত বালাই ব্যবস্থাপনা (আইপিএম) এর সহজ উপায়',
    },
    summary: {
      en: 'Effective strategies for managing fungal infections, stem borers, and leaf curl virus during rainy periods without excessive chemical runoff.',
      bn: 'অতিরিক্ত বৃষ্টির কারণে ফসলে ছত্রাক ও ডাঁটা ছিদ্রকারী পোকার উপদ্রব রোধে নিরাপদ ও পরিবেশবান্ধব সমন্বিত বালাই ব্যবস্থাপনা।',
    },
    content: {
      en: 'During the monsoon, elevated humidity accelerates spore germination for sheath blight and downy mildew. Implement light traps, pheromone lures, and prophylactic copper-based bio-fungicides prior to heavy rain to prevent severe yield loss.',
      bn: 'বর্ষার আর্দ্র আবহাওয়ায় ব্লাস্ট ও ধসা রোগের ছত্রাক দ্রুত ছড়ায়। ফসলে আলোর ফাঁদ, সেক্স ফেরোমন ট্র্যাপ এবং পরিমিত মাত্রায় প্রতিষেধক ছত্রাকনাশক ব্যবহার করলে ফসল ক্ষয়ক্ষতি থেকে রক্ষা পায়। নিয়মিত জমির নিষ্কাশন নালা পরিষ্কার রাখা অত্যন্ত জরুরি।',
    },
    date: { en: 'September 28, 2026', bn: '২৮ সেপ্টেম্বর, ২০২৬' },
    readTime: { en: '5 min read', bn: '৫ মিনিট পাঠ্য' },
    author: { en: 'Engr. Rafiqul Islam', bn: 'ইঞ্জি. রফিকুল ইসলাম' },
    icon: '🛡️',
    gradient: 'linear-gradient(135deg, rgba(234, 179, 8, 0.15), rgba(202, 138, 4, 0.25))',
  },
  {
    id: 'hybrid-seed-germination',
    category: { en: 'Seeds & Propagation', bn: 'বীজ ও চারা' },
    title: {
      en: 'Best Practices for 95%+ Hybrid Seed Germination Rates',
      bn: 'উচ্চফলনশীল হাইব্রিড বীজের ৯৫%+ অঙ্কুরোদগম নিশ্চিত করার টিপস',
    },
    summary: {
      en: 'Essential seed priming, temperature control, and tray seedling nursery techniques for vegetable and hybrid paddy farmers.',
      bn: 'বীজ শোধন, সঠিক তাপমাত্রায় জাগ দেওয়া ও ট্রে নার্সারিতে চারা তৈরির আধুনিক বৈজ্ঞানিক কলাকৌশল।',
    },
    content: {
      en: 'Treat seeds with a mild fungicide solution before soaking for 18-24 hours. Ensure optimal ambient incubation between 25°C-30°C for uniform sprout emergence before transferring to pro-trays or nursery beds.',
      bn: 'বীজ ভিজানোর আগে ছত্রাকনাশক বা বীজ শোধনকারী পাউডার দিয়ে শোধন করে নিন। ১৮-২৪ ঘণ্টা ভিজিয়ে রেখে সুতি কাপড়ে সঠিক তাপে জাগ দিলে প্রায় ৯৫% এর বেশি সতেজ অঙ্কুরোদগম নিশ্চিত হয়।',
    },
    date: { en: 'September 19, 2026', bn: '১৯ সেপ্টেম্বর, ২০২৬' },
    readTime: { en: '3 min read', bn: '৩ মিনিট পাঠ্য' },
    author: { en: 'Rafsan Agro Technical Team', bn: 'রফসান এগ্রো কারিগরি দল' },
    icon: '🌾',
    gradient: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(37, 99, 235, 0.25))',
  },
  {
    id: 'drip-irrigation-smart-farming',
    category: { en: 'Modern Farming', bn: 'আধুনিক চাষাবাদ' },
    title: {
      en: 'Smart Drip Irrigation: Save 60% Water and Increase Quality',
      bn: 'স্মার্ট ড্রিপ সেচ পদ্ধতি: ৬০% পর্যন্ত পানি সাশ্রয় ও উন্নত মানের ফসল',
    },
    summary: {
      en: 'How micro-irrigation and fertigation drastically reduce operational costs while delivering nutrients straight to plant root zones.',
      bn: 'ড্রিপ বা ফোঁটা ফোঁটা সেচ পদ্ধতির মাধ্যমে গাছের গোড়ায় সুষম পুষ্টি ও সার পৌঁছে দিয়ে পানির অপচয় রোধ ও বাম্পার ফলন।',
    },
    content: {
      en: 'Drip irrigation combined with soluble fertigation ensures optimal root-zone nourishment with minimal evaporation loss. Farms transitioning to localized drip see an average of 35% higher commercial grade produce and up to 60% savings on water energy bills.',
      bn: 'ড্রিপ সেচের সাহায্যে পানির সাথে মিশে সরাসরি গাছের গোড়ায় দ্রবণীয় সার পৌঁছে যায় (ফার্টিগেশন)। এতে আগাছা জন্মায় না এবং প্রচলিত সেচের চেয়ে ৬০% কম পানিতে ৩৫% বেশি উন্নত মানের বাণিজ্যিক ফসল উৎপাদন সম্ভব।',
    },
    date: { en: 'September 10, 2026', bn: '১০ সেপ্টেম্বর, ২০২৬' },
    readTime: { en: '6 min read', bn: '৬ মিনিট পাঠ্য' },
    author: { en: 'Kamrul Hasan (Irrigation Spec.)', bn: 'কামরুল হাসান (সেচ বিশেষজ্ঞ)' },
    icon: '💧',
    gradient: 'linear-gradient(135deg, rgba(20, 184, 166, 0.15), rgba(13, 148, 136, 0.25))',
  },
];

const CATEGORIES = [
  { id: 'all', en: 'All Articles', bn: 'সকল নিবন্ধ' },
  { id: 'Soil & Fertilizer', en: 'Soil & Fertilizer', bn: 'সার ও মাটি' },
  { id: 'Crop Protection', en: 'Crop Protection', bn: 'বালাইনাশক ও ফসল সুরক্ষা' },
  { id: 'Seeds & Propagation', en: 'Seeds & Propagation', bn: 'বীজ ও চারা' },
  { id: 'Modern Farming', en: 'Modern Farming', bn: 'আধুনিক চাষাবাদ' },
];

export default function BlogPage() {
  const { lang } = useI18n();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeArticle, setActiveArticle] = useState<BlogPost | null>(null);

  const filteredPosts = useMemo(() => {
    return BLOG_POSTS.filter((post) => {
      const matchesCategory =
        selectedCategory === 'all' || post.category.en === selectedCategory;
      const title = lang === 'bn' ? post.title.bn : post.title.en;
      const summary = lang === 'bn' ? post.summary.bn : post.summary.en;
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        title.toLowerCase().includes(query) ||
        summary.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery, lang]);

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
                lang === 'bn' ? 'আর্টিকেল বা বিষয় অনুসন্ধান করুন...' : 'Search articles, topics or keywords...'
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
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '10px',
            marginBottom: 'var(--space-8)',
            justifyContent: 'center',
          }}
        >
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
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
                {lang === 'bn' ? cat.bn : cat.en}
              </button>
            );
          })}
        </div>

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
            {lang === 'bn'
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
        {filteredPosts.length === 0 ? (
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
                ? 'অন্য কোনো শব্দ দিয়ে অনুসন্ধান করুন বা ফিল্টার পরিবর্তন করুন।'
                : 'Try searching with different keywords or selecting another category.'}
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="btn btn-secondary"
            >
              {lang === 'bn' ? 'সব দেখুন' : 'Reset Filters'}
            </button>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: 'var(--space-6)',
            }}
          >
            {filteredPosts.map((post) => (
              <article
                key={post.id}
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
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 12px 28px rgba(75, 166, 37, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.04)';
                }}
                onClick={() => setActiveArticle(post)}
              >
                {/* Visual Header / Badge */}
                <div
                  style={{
                    background: post.gradient,
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
                    {lang === 'bn' ? post.category.bn : post.category.en}
                  </span>
                  <span style={{ fontSize: '1.75rem' }}>{post.icon}</span>
                </div>

                {/* Article Body */}
                <div style={{ padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
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
                      {lang === 'bn' ? post.date.bn : post.date.en}
                    </span>
                    <span>•</span>
                    <span className="inline-flex items-center gap-1">
                      <Clock size={13} animateOnHover />
                      {lang === 'bn' ? post.readTime.bn : post.readTime.en}
                    </span>
                  </div>

                  <h2
                    style={{
                      fontSize: 'var(--text-lg)',
                      fontWeight: 800,
                      lineHeight: 1.4,
                      marginBottom: 'var(--space-3)',
                      color: 'var(--text-primary, #0f172a)',
                    }}
                  >
                    {lang === 'bn' ? post.title.bn : post.title.en}
                  </h2>

                  <p
                    style={{
                      fontSize: 'var(--text-sm)',
                      color: 'var(--text-secondary, #475569)',
                      lineHeight: 'var(--leading-relaxed)',
                      marginBottom: 'var(--space-6)',
                      flexGrow: 1,
                    }}
                  >
                    {lang === 'bn' ? post.summary.bn : post.summary.en}
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
                      {lang === 'bn' ? post.author.bn : post.author.en}
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
                      <span>{lang === 'bn' ? 'বিস্তারিত পড়ুন' : 'Read Article'}</span>
                      <ArrowRight size={14} animateOnHover />
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Article Detail Modal */}
      {activeArticle && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: 'var(--space-4)',
          }}
          onClick={() => setActiveArticle(null)}
        >
          <div
            style={{
              background: 'var(--bg-primary, #ffffff)',
              borderRadius: 'var(--radius-2xl, 20px)',
              maxWidth: '680px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              position: 'relative',
              padding: 'var(--space-8)',
              border: '1px solid var(--border-light, #e2e8f0)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveArticle(null)}
              style={{
                position: 'absolute',
                top: '18px',
                right: '18px',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'var(--bg-secondary, #f1f5f9)',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-secondary, #475569)',
              }}
              aria-label="Close"
            >
              <X size={18} animateOnHover />
            </button>

            <div
              style={{
                display: 'inline-block',
                background: 'rgba(75, 166, 37, 0.12)',
                color: '#1B7A3D',
                padding: '4px 12px',
                borderRadius: '9999px',
                fontSize: 'var(--text-xs)',
                fontWeight: 700,
                marginBottom: 'var(--space-3)',
              }}
            >
              {lang === 'bn' ? activeArticle.category.bn : activeArticle.category.en}
            </div>

            <h2
              style={{
                fontSize: 'var(--text-2xl)',
                fontWeight: 800,
                lineHeight: 1.3,
                marginBottom: 'var(--space-4)',
                color: 'var(--text-primary, #0f172a)',
              }}
            >
              {lang === 'bn' ? activeArticle.title.bn : activeArticle.title.en}
            </h2>

            <div
              style={{
                display: 'flex',
                gap: '12px',
                alignItems: 'center',
                fontSize: 'var(--text-xs)',
                color: 'var(--text-secondary, #64748b)',
                marginBottom: 'var(--space-6)',
                paddingBottom: 'var(--space-4)',
                borderBottom: '1px solid var(--border-light, #e2e8f0)',
                flexWrap: 'wrap',
              }}
            >
              <span className="inline-flex items-center gap-1">
                <User size={13} animateOnHover />
                {lang === 'bn' ? activeArticle.author.bn : activeArticle.author.en}
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1">
                <Calendar size={13} animateOnHover />
                {lang === 'bn' ? activeArticle.date.bn : activeArticle.date.en}
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1">
                <Clock size={13} animateOnHover />
                {lang === 'bn' ? activeArticle.readTime.bn : activeArticle.readTime.en}
              </span>
            </div>

            <div
              style={{
                fontSize: 'var(--text-base)',
                lineHeight: 1.8,
                color: 'var(--text-primary, #334155)',
                marginBottom: 'var(--space-6)',
              }}
            >
              <p style={{ marginBottom: 'var(--space-4)' }}>
                {lang === 'bn' ? activeArticle.summary.bn : activeArticle.summary.en}
              </p>
              <p>
                {lang === 'bn' ? activeArticle.content.bn : activeArticle.content.en}
              </p>
            </div>

            <div
              style={{
                background: 'var(--bg-secondary, #f8fafc)',
                padding: 'var(--space-4)',
                borderRadius: 'var(--radius-lg, 12px)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '12px',
              }}
            >
              <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary, #64748b)' }}>
                {lang === 'bn'
                  ? 'প্রয়োজনীয় সার ও বীজ অনলাইনে অর্ডার করতে ভিজিট করুন'
                  : 'Order quality seeds & fertilizers online directly'}
              </span>
              <Link
                href="/products"
                onClick={() => setActiveArticle(null)}
                style={{
                  background: 'linear-gradient(135deg, #4BA625, #3D8A1E)',
                  color: '#ffffff',
                  padding: '8px 16px',
                  borderRadius: '9999px',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                {lang === 'bn' ? 'পণ্য দেখুন →' : 'View Products →'}
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
