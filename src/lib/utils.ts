// Utility functions for Rafsan Agro

/**
 * Format price with Bangladeshi Taka symbol
 */
export function formatPrice(amount: number): string {
  return `৳${amount.toLocaleString('en-BD')}`;
}

export const formatCurrency = formatPrice;

/**
 * Format price in Bangla numerals
 */
export function formatPriceBn(amount: number): string {
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  const formatted = amount.toLocaleString('en-BD');
  const bnFormatted = formatted.replace(/[0-9]/g, (d) => bnDigits[parseInt(d)]);
  return `৳${bnFormatted}`;
}

/**
 * Format date
 */
export function formatDate(date: Date | string, locale: string = 'en-US'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString(locale === 'bn' ? 'bn-BD' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Format date with time
 */
export function formatDateTime(date: Date | string, locale: string = 'en-US'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString(locale === 'bn' ? 'bn-BD' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Generate a unique order number
 */
export function generateOrderNumber(): string {
  const prefix = 'RA';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

/**
 * Slugify text for URLs
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}

/**
 * Calculate discount percentage
 */
export function calcDiscountPercent(originalPrice: number, discountPrice: number): number {
  if (originalPrice <= 0) return 0;
  return Math.round(((originalPrice - discountPrice) / originalPrice) * 100);
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Class names helper — joins truthy class strings
 */
export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Get initials from a name
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
}

/**
 * Format large numbers (e.g., 1.2K, 5.3M)
 */
export function formatCompact(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}

/**
 * Product unit labels
 */
export const UNIT_LABELS: Record<string, { en: string; bn: string }> = {
  kg: { en: 'kg', bn: 'কেজি' },
  g: { en: 'g', bn: 'গ্রাম' },
  piece: { en: 'pc', bn: 'পিস' },
  packet: { en: 'pkt', bn: 'প্যাকেট' },
  bag: { en: 'bag', bn: 'ব্যাগ' },
  liter: { en: 'L', bn: 'লিটার' },
  ml: { en: 'ml', bn: 'মিলি' },
  bottle: { en: 'bottle', bn: 'বোতল' },
  box: { en: 'box', bn: 'বক্স' },
  set: { en: 'set', bn: 'সেট' },
};

/**
 * Order status colors
 */
export const ORDER_STATUS_COLORS: Record<string, string> = {
  PENDING: 'status-pending',
  PROCESSING: 'status-processing',
  SHIPPED: 'status-shipped',
  DELIVERED: 'status-delivered',
  CANCELLED: 'status-cancelled',
};

/**
 * Expense categories with colors and bilingual names
 */
export const EXPENSE_CATEGORIES = [
  { id: 'PURCHASE', label_en: 'Purchase', label_bn: 'পণ্য ক্রয়', label: 'Purchase - পণ্য ক্রয়', color: '#ef4444', icon: '📦' },
  { id: 'SALARY', label_en: 'Salary', label_bn: 'কর্মী বেতন', label: 'Salary - কর্মী বেতন', color: '#8b5cf6', icon: '👤' },
  { id: 'RENT', label_en: 'Rent', label_bn: 'ভাড়া', label: 'Rent - দোকান ও জমি ভাড়া', color: '#f59e0b', icon: '🏠' },
  { id: 'TRANSPORT', label_en: 'Transport', label_bn: 'পরিবহন', label: 'Transport - পরিবহন খরচ', color: '#06b6d4', icon: '🚛' },
  { id: 'UTILITY', label_en: 'Utilities', label_bn: 'ইউটিলিটি বিল', label: 'Utilities - ইউটিলিটি বিল', color: '#10b981', icon: '⚡' },
  { id: 'MARKETING', label_en: 'Marketing', label_bn: 'মার্কেটিং', label: 'Marketing - বিজ্ঞাপন ও প্রচার', color: '#ec4899', icon: '📢' },
  { id: 'EQUIPMENT', label_en: 'Equipment', label_bn: 'সরঞ্জাম', label: 'Equipment - যন্ত্রপাতি ও সরঞ্জাম', color: '#6366f1', icon: '🔧' },
  { id: 'MAINTENANCE', label_en: 'Maintenance', label_bn: 'রক্ষণাবেক্ষণ', label: 'Maintenance - রক্ষণাবেক্ষণ', color: '#6366f1', icon: '🔧' },
  { id: 'OTHER', label_en: 'Other', label_bn: 'অন্যান্য', label: 'Other - অন্যান্য ব্যয়', color: '#64748b', icon: '📋' },
];

/**
 * Income categories with bilingual names
 */
export const INCOME_CATEGORIES = [
  { id: 'SALE', label_en: 'Product Sale', label_bn: 'পণ্য বিক্রয়', label: 'Product Sales - পণ্য বিক্রয়', color: '#22c55e', icon: '🛒' },
  { id: 'SERVICE', label_en: 'Service', label_bn: 'সেবা ও পরামর্শ', label: 'Services - সেবা ও পরামর্শ', color: '#3b82f6', icon: '🔧' },
  { id: 'INVESTMENT', label_en: 'Investment', label_bn: 'বিনিয়োগ', label: 'Investment - বিনিয়োগ', color: '#d4a843', icon: '💰' },
  { id: 'OTHER_INCOME', label_en: 'Other Income', label_bn: 'অন্যান্য আয়', label: 'Other Income - অন্যান্য আয়', color: '#64748b', icon: '📋' },
  { id: 'OTHER', label_en: 'Other Income', label_bn: 'অন্যান্য আয়', label: 'Other Income - অন্যান্য আয়', color: '#64748b', icon: '📋' },
];

/**
 * Finance Category Labels dictionary for bilingual rendering
 */
export const FINANCE_CATEGORY_MAP: Record<string, { en: string; bn: string; label: string }> = {
  SALE: { en: 'Product Sales', bn: 'পণ্য বিক্রয়', label: 'Product Sales - পণ্য বিক্রয়' },
  SERVICE: { en: 'Services & Consulting', bn: 'সেবা ও পরামর্শ', label: 'Services - সেবা ও পরামর্শ' },
  OTHER_INCOME: { en: 'Other Income', bn: 'অন্যান্য আয়', label: 'Other Income - অন্যান্য আয়' },
  INVESTMENT: { en: 'Investment', bn: 'বিনিয়োগ', label: 'Investment - বিনিয়োগ' },
  PURCHASE: { en: 'Inventory Purchase', bn: 'পণ্য ক্রয়', label: 'Purchase - পণ্য ক্রয়' },
  SALARY: { en: 'Salary & Wages', bn: 'কর্মী বেতন', label: 'Salary - কর্মী বেতন' },
  RENT: { en: 'Shop & Land Rent', bn: 'দোকান ও জমি ভাড়া', label: 'Rent - দোকান ও জমি ভাড়া' },
  TRANSPORT: { en: 'Transport & Freight', bn: 'পরিবহন খরচ', label: 'Transport - পরিবহন খরচ' },
  UTILITY: { en: 'Utility Bills', bn: 'ইউটিলিটি বিল', label: 'Utility - ইউটিলিটি বিল' },
  MARKETING: { en: 'Marketing & Ads', bn: 'বিজ্ঞাপন ও প্রচার', label: 'Marketing - বিজ্ঞাপন ও প্রচার' },
  EQUIPMENT: { en: 'Machinery & Equipment', bn: 'যন্ত্রপাতি ও সরঞ্জাম', label: 'Equipment - যন্ত্রপাতি ও সরঞ্জাম' },
  MAINTENANCE: { en: 'Maintenance', bn: 'রক্ষণাবেক্ষণ', label: 'Maintenance - রক্ষণাবেক্ষণ' },
  OTHER: { en: 'Other Expense', bn: 'অন্যান্য ব্যয়', label: 'Other - অন্যান্য ব্যয়' },
};

/**
 * Format category ID to bilingual name (e.g., "PURCHASE" -> "Purchase - পণ্য ক্রয়")
 */
export function formatCategoryName(category: string): string {
  if (!category) return '';
  if (category.startsWith('OTHER:') || category.startsWith('OTHER_INCOME:')) {
    const custom = category.substring(category.indexOf(':') + 1).trim();
    return custom ? `Other (${custom})` : 'Other';
  }
  const item = FINANCE_CATEGORY_MAP[category.toUpperCase()];
  if (item) return item.label;
  return category;
}

