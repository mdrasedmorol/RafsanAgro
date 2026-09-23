// Demo data for Rafsan Agro — used when database is not connected
// This allows the app to run fully in demo mode

export interface DemoCategory {
  id: string;
  nameEn: string;
  nameBn: string;
  slug: string;
  description: string;
  image: string;
  icon: string;
  productCount: number;
}

export interface DemoProduct {
  id: string;
  nameEn: string;
  nameBn: string;
  slug: string;
  descriptionEn: string;
  descriptionBn: string;
  price: number;
  discountPrice?: number;
  stock: number;
  sku: string;
  unit: string;
  categoryId: string;
  categoryName: string;
  categorySlug: string;
  images: string[];
  isFeatured: boolean;
  isActive: boolean;
  weight?: string;
  brand?: string;
  tags: string[];
}

export interface DemoOrder {
  id: string;
  orderNumber: string;
  status: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  customerArea: string;
  subtotal: number;
  deliveryCharge: number;
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  items: { productName: string; quantity: number; unitPrice: number; total: number }[];
  createdAt: string;
}

export interface DemoTransaction {
  id: string;
  type: 'INCOME' | 'EXPENSE';
  category: string;
  amount: number;
  description: string;
  reference?: string;
  date: string;
}

// ==================
// CATEGORIES
// ==================
export const demoCategories: DemoCategory[] = [
  {
    id: 'cat-1',
    nameEn: 'Seeds',
    nameBn: 'বীজ',
    slug: 'seeds',
    description: 'High-quality seeds for all types of crops',
    image: '/images/categories/seeds.jpg',
    icon: '🌱',
    productCount: 12,
  },
  {
    id: 'cat-2',
    nameEn: 'Fertilizers',
    nameBn: 'সার',
    slug: 'fertilizers',
    description: 'Organic and chemical fertilizers for maximum yield',
    image: '/images/categories/fertilizers.jpg',
    icon: '🧪',
    productCount: 8,
  },
  {
    id: 'cat-3',
    nameEn: 'Pesticides',
    nameBn: 'কীটনাশক',
    slug: 'pesticides',
    description: 'Safe and effective pest control solutions',
    image: '/images/categories/pesticides.jpg',
    icon: '🛡️',
    productCount: 10,
  },
  {
    id: 'cat-4',
    nameEn: 'Farm Tools',
    nameBn: 'কৃষি যন্ত্রপাতি',
    slug: 'farm-tools',
    description: 'Essential tools for modern farming',
    image: '/images/categories/tools.jpg',
    icon: '🔧',
    productCount: 15,
  },
  {
    id: 'cat-5',
    nameEn: 'Irrigation',
    nameBn: 'সেচ সরঞ্জাম',
    slug: 'irrigation',
    description: 'Drip irrigation and water management systems',
    image: '/images/categories/irrigation.jpg',
    icon: '💧',
    productCount: 6,
  },
  {
    id: 'cat-6',
    nameEn: 'Animal Feed',
    nameBn: 'পশু খাদ্য',
    slug: 'animal-feed',
    description: 'Nutritious feed for livestock and poultry',
    image: '/images/categories/feed.jpg',
    icon: '🐄',
    productCount: 7,
  },
];

// ==================
// PRODUCTS
// ==================
export const demoProducts: DemoProduct[] = [
  // Seeds
  {
    id: 'prod-1',
    nameEn: 'BARI Hybrid Rice Seed (5kg)',
    nameBn: 'বারি হাইব্রিড ধানের বীজ (৫ কেজি)',
    slug: 'bari-hybrid-rice-seed-5kg',
    descriptionEn: 'Premium hybrid rice seed developed by BARI for maximum yield. Suitable for Aman and Boro season. Average yield 7-8 tons per hectare with proper management.',
    descriptionBn: 'সর্বোচ্চ ফলনের জন্য বারি দ্বারা উন্নত প্রিমিয়াম হাইব্রিড ধানের বীজ। আমন ও বোরো মৌসুমের জন্য উপযুক্ত। সঠিক ব্যবস্থাপনায় প্রতি হেক্টরে গড় ফলন ৭-৮ টন।',
    price: 1200,
    discountPrice: 999,
    stock: 150,
    sku: 'SEED-RICE-001',
    unit: 'bag',
    categoryId: 'cat-1',
    categoryName: 'Seeds',
    categorySlug: 'seeds',
    images: ['/images/products/rice-seed.jpg'],
    isFeatured: true,
    isActive: true,
    weight: '5kg',
    brand: 'BARI',
    tags: ['rice', 'hybrid', 'aman', 'boro'],
  },
  {
    id: 'prod-2',
    nameEn: 'Vegetable Seed Collection (10 Pack)',
    nameBn: 'সবজি বীজ কালেকশন (১০ প্যাক)',
    slug: 'vegetable-seed-collection-10-pack',
    descriptionEn: 'A curated collection of 10 different vegetable seeds including tomato, brinjal, chili, okra, gourd, beans, spinach, radish, carrot, and cucumber. Each packet contains enough seeds for home garden or small farm.',
    descriptionBn: 'টমেটো, বেগুন, মরিচ, ঢেঁড়স, লাউ, শিম, পালং শাক, মূলা, গাজর এবং শসা সহ ১০ ধরনের সবজি বীজের একটি সংকলন।',
    price: 450,
    discountPrice: 380,
    stock: 200,
    sku: 'SEED-VEG-001',
    unit: 'set',
    categoryId: 'cat-1',
    categoryName: 'Seeds',
    categorySlug: 'seeds',
    images: ['/images/products/veg-seeds.jpg'],
    isFeatured: true,
    isActive: true,
    brand: 'Lal Teer',
    tags: ['vegetable', 'collection', 'home-garden'],
  },
  {
    id: 'prod-3',
    nameEn: 'Wheat Seed HD-2967 (10kg)',
    nameBn: 'গমের বীজ HD-2967 (১০ কেজি)',
    slug: 'wheat-seed-hd-2967-10kg',
    descriptionEn: 'High-yield wheat variety HD-2967. Rust resistant and suitable for late sowing. Expected yield 45-50 quintals per hectare.',
    descriptionBn: 'উচ্চ ফলনশীল গমের জাত HD-2967। মরিচা প্রতিরোধী এবং দেরিতে বপনের জন্য উপযুক্ত।',
    price: 800,
    stock: 85,
    sku: 'SEED-WHEAT-001',
    unit: 'bag',
    categoryId: 'cat-1',
    categoryName: 'Seeds',
    categorySlug: 'seeds',
    images: ['/images/products/wheat-seed.jpg'],
    isFeatured: false,
    isActive: true,
    weight: '10kg',
    tags: ['wheat', 'rabi'],
  },
  // Fertilizers
  {
    id: 'prod-4',
    nameEn: 'DAP Fertilizer (50kg)',
    nameBn: 'ডিএপি সার (৫০ কেজি)',
    slug: 'dap-fertilizer-50kg',
    descriptionEn: 'Di-ammonium Phosphate (DAP) fertilizer with 18-46-0 NPK ratio. Essential phosphorus source for root development and flowering. Suitable for all crops.',
    descriptionBn: 'ডাই-অ্যামোনিয়াম ফসফেট (ডিএপি) সার, ১৮-৪৬-০ NPK অনুপাত। শিকড় বিকাশ এবং ফুল ফোটার জন্য প্রয়োজনীয় ফসফরাস উৎস।',
    price: 2800,
    discountPrice: 2500,
    stock: 50,
    sku: 'FERT-DAP-001',
    unit: 'bag',
    categoryId: 'cat-2',
    categoryName: 'Fertilizers',
    categorySlug: 'fertilizers',
    images: ['/images/products/dap.jpg'],
    isFeatured: true,
    isActive: true,
    weight: '50kg',
    brand: 'IFFCO',
    tags: ['dap', 'phosphorus', 'all-crop'],
  },
  {
    id: 'prod-5',
    nameEn: 'Urea Fertilizer (50kg)',
    nameBn: 'ইউরিয়া সার (৫০ কেজি)',
    slug: 'urea-fertilizer-50kg',
    descriptionEn: 'High-quality Urea fertilizer with 46% Nitrogen content. The most important nitrogen source for crop growth and green foliage development.',
    descriptionBn: 'উচ্চ মানের ইউরিয়া সার, ৪৬% নাইট্রোজেন। ফসলের বৃদ্ধি এবং সবুজ পাতা বিকাশের জন্য সবচেয়ে গুরুত্বপূর্ণ নাইট্রোজেন উৎস।',
    price: 1800,
    stock: 120,
    sku: 'FERT-UREA-001',
    unit: 'bag',
    categoryId: 'cat-2',
    categoryName: 'Fertilizers',
    categorySlug: 'fertilizers',
    images: ['/images/products/urea.jpg'],
    isFeatured: false,
    isActive: true,
    weight: '50kg',
    tags: ['urea', 'nitrogen'],
  },
  {
    id: 'prod-6',
    nameEn: 'Organic Vermicompost (25kg)',
    nameBn: 'জৈব ভার্মিকম্পোস্ট (২৫ কেজি)',
    slug: 'organic-vermicompost-25kg',
    descriptionEn: '100% organic vermicompost made from earthworm castings. Rich in beneficial microorganisms, humus, and essential nutrients. Perfect for organic farming.',
    descriptionBn: 'কেঁচো কম্পোস্ট থেকে তৈরি ১০০% জৈব ভার্মিকম্পোস্ট। উপকারী অণুজীব, হিউমাস এবং প্রয়োজনীয় পুষ্টিতে সমৃদ্ধ।',
    price: 650,
    discountPrice: 550,
    stock: 200,
    sku: 'FERT-ORG-001',
    unit: 'bag',
    categoryId: 'cat-2',
    categoryName: 'Fertilizers',
    categorySlug: 'fertilizers',
    images: ['/images/products/vermicompost.jpg'],
    isFeatured: true,
    isActive: true,
    weight: '25kg',
    tags: ['organic', 'vermicompost', 'eco-friendly'],
  },
  // Pesticides
  {
    id: 'prod-7',
    nameEn: 'Neem Oil Organic Pesticide (1L)',
    nameBn: 'নিম তেল জৈব কীটনাশক (১ লিটার)',
    slug: 'neem-oil-organic-pesticide-1l',
    descriptionEn: 'Natural neem oil-based pesticide for eco-friendly pest control. Effective against aphids, whiteflies, mealybugs, and spider mites. Safe for beneficial insects.',
    descriptionBn: 'পরিবেশবান্ধব পোকামাকড় নিয়ন্ত্রণের জন্য প্রাকৃতিক নিম তেল ভিত্তিক কীটনাশক।',
    price: 350,
    stock: 300,
    sku: 'PEST-NEEM-001',
    unit: 'bottle',
    categoryId: 'cat-3',
    categoryName: 'Pesticides',
    categorySlug: 'pesticides',
    images: ['/images/products/neem-oil.jpg'],
    isFeatured: false,
    isActive: true,
    brand: 'AgroBio',
    tags: ['organic', 'neem', 'eco-friendly'],
  },
  {
    id: 'prod-8',
    nameEn: 'Chlorpyrifos 20EC (500ml)',
    nameBn: 'ক্লোরপাইরিফস ২০ইসি (৫০০ মিলি)',
    slug: 'chlorpyrifos-20ec-500ml',
    descriptionEn: 'Broad-spectrum insecticide for controlling borers, cutworms, and soil insects in rice, vegetables, and fruit crops.',
    descriptionBn: 'ধান, সবজি এবং ফল ফসলে ছিদ্রকারী পোকা, কাটুয়া পোকা নিয়ন্ত্রণের জন্য বিস্তৃত পরিসরের কীটনাশক।',
    price: 280,
    discountPrice: 245,
    stock: 150,
    sku: 'PEST-CHL-001',
    unit: 'bottle',
    categoryId: 'cat-3',
    categoryName: 'Pesticides',
    categorySlug: 'pesticides',
    images: ['/images/products/chlorpyrifos.jpg'],
    isFeatured: true,
    isActive: true,
    brand: 'Syngenta',
    tags: ['insecticide', 'broad-spectrum'],
  },
  // Farm Tools
  {
    id: 'prod-9',
    nameEn: 'Manual Seed Planter',
    nameBn: 'ম্যানুয়াল সীড প্লান্টার',
    slug: 'manual-seed-planter',
    descriptionEn: 'Ergonomic hand-held seed planter for precise seed placement. Adjustable depth and spacing. Saves time and reduces seed waste. Works with most seed types.',
    descriptionBn: 'সুনির্দিষ্ট বীজ স্থাপনের জন্য এরগোনমিক হ্যান্ড-হেল্ড সীড প্লান্টার। সামঞ্জস্যযোগ্য গভীরতা এবং দূরত্ব।',
    price: 1500,
    discountPrice: 1299,
    stock: 45,
    sku: 'TOOL-PLANT-001',
    unit: 'piece',
    categoryId: 'cat-4',
    categoryName: 'Farm Tools',
    categorySlug: 'farm-tools',
    images: ['/images/products/seed-planter.jpg'],
    isFeatured: true,
    isActive: true,
    tags: ['planter', 'manual', 'ergonomic'],
  },
  {
    id: 'prod-10',
    nameEn: 'Knapsack Sprayer (16L)',
    nameBn: 'ন্যাপস্যাক স্প্রেয়ার (১৬ লিটার)',
    slug: 'knapsack-sprayer-16l',
    descriptionEn: '16-liter capacity manual knapsack sprayer with adjustable nozzle. Ideal for spraying pesticides, herbicides, and foliar fertilizers. Durable construction with comfortable straps.',
    descriptionBn: '১৬ লিটার ক্ষমতার ম্যানুয়াল ন্যাপস্যাক স্প্রেয়ার। কীটনাশক, আগাছানাশক এবং পাতায় সার স্প্রে করার জন্য আদর্শ।',
    price: 1800,
    stock: 60,
    sku: 'TOOL-SPRAY-001',
    unit: 'piece',
    categoryId: 'cat-4',
    categoryName: 'Farm Tools',
    categorySlug: 'farm-tools',
    images: ['/images/products/sprayer.jpg'],
    isFeatured: false,
    isActive: true,
    tags: ['sprayer', 'manual', '16-liter'],
  },
  {
    id: 'prod-11',
    nameEn: 'Garden Pruning Shear Set',
    nameBn: 'গার্ডেন প্রুনিং শিয়ার সেট',
    slug: 'garden-pruning-shear-set',
    descriptionEn: 'Professional 3-piece pruning shear set including bypass pruner, hedge shear, and lopper. Carbon steel blades with non-slip grip handles.',
    descriptionBn: 'পেশাদার ৩-পিস প্রুনিং শিয়ার সেট। বাইপাস প্রুনার, হেজ শিয়ার এবং লপার সহ। কার্বন স্টিল ব্লেড।',
    price: 950,
    discountPrice: 799,
    stock: 80,
    sku: 'TOOL-PRUNE-001',
    unit: 'set',
    categoryId: 'cat-4',
    categoryName: 'Farm Tools',
    categorySlug: 'farm-tools',
    images: ['/images/products/pruning-shear.jpg'],
    isFeatured: true,
    isActive: true,
    tags: ['pruning', 'garden', 'tool-set'],
  },
  // Irrigation
  {
    id: 'prod-12',
    nameEn: 'Drip Irrigation Kit (100 Plants)',
    nameBn: 'ড্রিপ ইরিগেশন কিট (১০০ গাছ)',
    slug: 'drip-irrigation-kit-100-plants',
    descriptionEn: 'Complete drip irrigation system for 100 plants. Includes main line, drip tubing, connectors, drippers, and filter. Saves 60% water compared to flood irrigation.',
    descriptionBn: '১০০ গাছের জন্য সম্পূর্ণ ড্রিপ ইরিগেশন সিস্টেম। প্লাবন সেচের তুলনায় ৬০% পানি সাশ্রয় করে।',
    price: 3500,
    discountPrice: 2999,
    stock: 25,
    sku: 'IRR-DRIP-001',
    unit: 'set',
    categoryId: 'cat-5',
    categoryName: 'Irrigation',
    categorySlug: 'irrigation',
    images: ['/images/products/drip-kit.jpg'],
    isFeatured: true,
    isActive: true,
    tags: ['drip', 'water-saving', 'complete-kit'],
  },
];

// ==================
// ORDERS (Demo)
// ==================
export const demoOrders: DemoOrder[] = [
  {
    id: 'order-1',
    orderNumber: 'RA-M1K2N3-ABC',
    status: 'DELIVERED',
    customerName: 'Karim Hossain',
    customerPhone: '01712345678',
    customerAddress: 'House 15, Road 3, Mirpur-10',
    customerArea: 'Mirpur',
    subtotal: 3499,
    deliveryCharge: 80,
    total: 3579,
    paymentMethod: 'CASH_ON_DELIVERY',
    paymentStatus: 'PAID',
    items: [
      { productName: 'BARI Hybrid Rice Seed (5kg)', quantity: 2, unitPrice: 999, total: 1998 },
      { productName: 'Organic Vermicompost (25kg)', quantity: 1, unitPrice: 550, total: 550 },
      { productName: 'Garden Pruning Shear Set', quantity: 1, unitPrice: 799, total: 799 },
    ],
    createdAt: '2024-09-15T10:30:00Z',
  },
  {
    id: 'order-2',
    orderNumber: 'RA-N4P5Q6-DEF',
    status: 'PROCESSING',
    customerName: 'Fatema Begum',
    customerPhone: '01898765432',
    customerAddress: 'Village: Raipura, Post: Narsingdi',
    customerArea: 'Narsingdi',
    subtotal: 5300,
    deliveryCharge: 120,
    total: 5420,
    paymentMethod: 'BKASH',
    paymentStatus: 'PAID',
    items: [
      { productName: 'DAP Fertilizer (50kg)', quantity: 1, unitPrice: 2500, total: 2500 },
      { productName: 'Urea Fertilizer (50kg)', quantity: 1, unitPrice: 1800, total: 1800 },
      { productName: 'Manual Seed Planter', quantity: 1, unitPrice: 1299, total: 1299 },
    ],
    createdAt: '2024-09-18T14:15:00Z',
  },
  {
    id: 'order-3',
    orderNumber: 'RA-R7S8T9-GHI',
    status: 'PENDING',
    customerName: 'Abdul Rahman',
    customerPhone: '01612345678',
    customerAddress: 'Bazaar Road, Rangpur Sadar',
    customerArea: 'Rangpur',
    subtotal: 6498,
    deliveryCharge: 150,
    total: 6648,
    paymentMethod: 'NAGAD',
    paymentStatus: 'UNPAID',
    items: [
      { productName: 'Drip Irrigation Kit (100 Plants)', quantity: 1, unitPrice: 2999, total: 2999 },
      { productName: 'BARI Hybrid Rice Seed (5kg)', quantity: 2, unitPrice: 999, total: 1998 },
      { productName: 'Vegetable Seed Collection (10 Pack)', quantity: 2, unitPrice: 380, total: 760 },
    ],
    createdAt: '2024-09-20T09:45:00Z',
  },
  {
    id: 'order-4',
    orderNumber: 'RA-U1V2W3-JKL',
    status: 'SHIPPED',
    customerName: 'Rina Akter',
    customerPhone: '01556789012',
    customerAddress: 'College Road, Comilla Sadar',
    customerArea: 'Comilla',
    subtotal: 1580,
    deliveryCharge: 80,
    total: 1660,
    paymentMethod: 'CASH_ON_DELIVERY',
    paymentStatus: 'UNPAID',
    items: [
      { productName: 'Neem Oil Organic Pesticide (1L)', quantity: 2, unitPrice: 350, total: 700 },
      { productName: 'Vegetable Seed Collection (10 Pack)', quantity: 1, unitPrice: 380, total: 380 },
      { productName: 'Knapsack Sprayer (16L)', quantity: 1, unitPrice: 1800, total: 1800 },
    ],
    createdAt: '2024-09-19T11:20:00Z',
  },
  {
    id: 'order-5',
    orderNumber: 'RA-X4Y5Z6-MNO',
    status: 'CANCELLED',
    customerName: 'Jamal Uddin',
    customerPhone: '01345678901',
    customerAddress: 'Station Road, Bogra',
    customerArea: 'Bogra',
    subtotal: 2500,
    deliveryCharge: 100,
    total: 2600,
    paymentMethod: 'BKASH',
    paymentStatus: 'REFUNDED',
    items: [
      { productName: 'DAP Fertilizer (50kg)', quantity: 1, unitPrice: 2500, total: 2500 },
    ],
    createdAt: '2024-09-14T16:00:00Z',
  },
];

// ==================
// TRANSACTIONS (Finance Demo Data)
// ==================
function generateTransactions(): DemoTransaction[] {
  const transactions: DemoTransaction[] = [];
  const baseYear = 2026;
  
  // Seeded deterministic pseudo-random helper
  let seed = 42;
  const pseudoRandom = () => {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  };
  
  // Generate 6 months of financial data
  for (let month = 5; month >= 0; month--) {
    const monthIndex = 8 - month;
    const daysInMonth = 28;
    
    // Sales income (7 per month)
    const salesCount = 7;
    for (let i = 0; i < salesCount; i++) {
      const day = 1 + Math.floor(pseudoRandom() * daysInMonth);
      const amount = 3500 + Math.floor(pseudoRandom() * 8000);
      const refCode = `RA-M${month}S${i}X`;
      transactions.push({
        id: `txn-inc-${month}-${i}`,
        type: 'INCOME',
        category: 'SALE',
        amount,
        description: `Product sale - Order #${refCode}`,
        reference: refCode,
        date: new Date(baseYear, monthIndex, day).toISOString(),
      });
    }
    
    // Monthly rent
    transactions.push({
      id: `txn-rent-${month}`,
      type: 'EXPENSE',
      category: 'RENT',
      amount: 15000,
      description: 'Monthly shop rent',
      date: new Date(baseYear, monthIndex, 1).toISOString(),
    });
    
    // Monthly salary
    transactions.push({
      id: `txn-sal-${month}`,
      type: 'EXPENSE',
      category: 'SALARY',
      amount: 28000,
      description: 'Staff salaries',
      date: new Date(baseYear, monthIndex, 5).toISOString(),
    });
    
    // Purchase expenses (3 per month)
    const categoriesList = ['Seeds', 'Fertilizers', 'Pesticides', 'Tools'];
    for (let i = 0; i < 3; i++) {
      const day = 2 + (i * 8);
      const amount = 8000 + Math.floor(pseudoRandom() * 12000);
      transactions.push({
        id: `txn-pur-${month}-${i}`,
        type: 'EXPENSE',
        category: 'PURCHASE',
        amount,
        description: `Stock purchase - ${categoriesList[i % 4]}`,
        date: new Date(baseYear, monthIndex, day).toISOString(),
      });
    }
    
    // Transport (2 per month)
    for (let i = 0; i < 2; i++) {
      const day = 4 + (i * 12);
      transactions.push({
        id: `txn-trans-${month}-${i}`,
        type: 'EXPENSE',
        category: 'TRANSPORT',
        amount: 2500,
        description: 'Delivery & transportation',
        date: new Date(baseYear, monthIndex, day).toISOString(),
      });
    }
    
    // Utilities
    transactions.push({
      id: `txn-util-${month}`,
      type: 'EXPENSE',
      category: 'UTILITY',
      amount: 4200,
      description: 'Electricity & water bill',
      date: new Date(baseYear, monthIndex, 15).toISOString(),
    });
    
    // Marketing
    transactions.push({
      id: `txn-mkt-${month}`,
      type: 'EXPENSE',
      category: 'MARKETING',
      amount: 3500,
      description: 'Social media ads & promotions',
      date: new Date(baseYear, monthIndex, 12).toISOString(),
    });
  }
  
  return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export const demoTransactions = generateTransactions();

// ==================
// Helper Functions
// ==================
export function getFinanceSummary(transactions: DemoTransaction[], period?: { start: Date; end: Date }) {
  let filtered = transactions;
  if (period) {
    filtered = transactions.filter(t => {
      const d = new Date(t.date);
      return d >= period.start && d <= period.end;
    });
  }
  
  const totalIncome = filtered
    .filter(t => t.type === 'INCOME')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpense = filtered
    .filter(t => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + t.amount, 0);
  
  return {
    totalIncome,
    totalExpense,
    netProfit: totalIncome - totalExpense,
    transactionCount: filtered.length,
  };
}

export function getMonthlyData(transactions: DemoTransaction[]) {
  const monthlyMap: Record<string, { income: number; expense: number; month: string }> = {};
  
  transactions.forEach(t => {
    const d = new Date(t.date);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const monthName = d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
    
    if (!monthlyMap[key]) {
      monthlyMap[key] = { income: 0, expense: 0, month: monthName };
    }
    
    if (t.type === 'INCOME') {
      monthlyMap[key].income += t.amount;
    } else {
      monthlyMap[key].expense += t.amount;
    }
  });
  
  return Object.entries(monthlyMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, v]) => ({ ...v, profit: v.income - v.expense }));
}

export function getExpenseByCategory(transactions: DemoTransaction[]) {
  const categoryMap: Record<string, number> = {};
  
  transactions
    .filter(t => t.type === 'EXPENSE')
    .forEach(t => {
      categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
    });
  
  return Object.entries(categoryMap).map(([name, value]) => ({ name, value }));
}
