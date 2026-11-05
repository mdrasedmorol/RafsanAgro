// Data contracts for Rafsan Agro

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
// EMPTY DATASETS (Demo Data Removed)
// ==================
export const demoCategories: DemoCategory[] = [];

export const demoProducts: DemoProduct[] = [];

export const demoOrders: DemoOrder[] = [];

export const demoTransactions: DemoTransaction[] = [];

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


// =====================
// Demo Articles
// =====================
export interface DemoArticle {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  coverImage: string | null;
  images: string[];
  videoUrl: string | null;
  documents: string[];
  category: string;
  tags: string[];
  author: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  isFeatured: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export const demoArticles: DemoArticle[] = [
  {
    id: 'art-1',
    title: 'Maximizing Crop Yield with Organic Fertilizers & Vermicompost',
    slug: 'maximizing-crop-yield-organic-fertilizers',
    summary: 'Learn how to balance soil micro-nutrients using balanced organic manure, improving moisture retention and microbial activity for higher returns.',
    content: `Organic fertilizers improve soil structure and enhance water retention capacity significantly. Unlike chemical inputs alone, high-grade vermicompost introduces beneficial micro-flora that activate dormant nutrients.

Key Benefits of Vermicompost:
1. Enhances microbial biodiversity in the root rhizosphere.
2. Increases water retention capacity by up to 30%.
3. Supplies essential micro-nutrients including Zinc, Boron, and Iron in readily absorbable chelated forms.

Application Guidelines:
Apply 300-500 kg per acre during initial land preparation to establish deep root aeration and long-term soil health. Combine with composted cow dung or poultry litter for optimal vegetative vigor.`,
    coverImage: 'https://images.unsplash.com/photo-1592417817098-8f3d69102a52?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=800&q=80',
    ],
    videoUrl: 'https://www.youtube.com/watch?v=ScMzIvxBSi4',
    documents: [],
    category: 'Soil & Fertilizer',
    tags: ['vermicompost', 'organic', 'soil-health', 'fertilizer'],
    author: 'Dr. M. Rahman (Agronomist)',
    status: 'PUBLISHED',
    isFeatured: true,
    publishedAt: '2026-10-05T08:00:00.000Z',
    createdAt: '2026-10-05T08:00:00.000Z',
    updatedAt: '2026-10-05T08:00:00.000Z',
  },
  {
    id: 'art-2',
    title: 'Integrated Pest Management (IPM) for High-Rain Seasons',
    slug: 'integrated-pest-management-monsoon',
    summary: 'Effective strategies for managing fungal infections, stem borers, and leaf curl virus during rainy periods without excessive chemical runoff.',
    content: `During the monsoon season, elevated ambient humidity accelerates fungal spore germination for sheath blight, downy mildew, and anthracnose. 

Integrated Pest Management (IPM) incorporates non-chemical controls first:
- Light Traps: Install solar light traps at 1 trap per 2 acres to capture nocturnal moth populations.
- Pheromone Lures: Deploy yellow sticky traps and species-specific sex pheromone lures.
- Bio-fungicides: Spray prophylactic Trichoderma viride or copper-based bio-fungicides prior to heavy rain to prevent severe yield loss.
- Drainage Maintenance: Keep field runoff trenches clean to prevent water stagnation around plant crowns.`,
    coverImage: 'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&w=1200&q=80',
    images: [],
    videoUrl: '',
    documents: [],
    category: 'Crop Protection',
    tags: ['ipm', 'pest-control', 'monsoon', 'crop-safety'],
    author: 'Engr. Rafiqul Islam',
    status: 'PUBLISHED',
    isFeatured: false,
    publishedAt: '2026-09-28T09:30:00.000Z',
    createdAt: '2026-09-28T09:30:00.000Z',
    updatedAt: '2026-09-28T09:30:00.000Z',
  },
  {
    id: 'art-3',
    title: 'Best Practices for 95%+ Hybrid Seed Germination Rates',
    slug: 'hybrid-seed-germination-best-practices',
    summary: 'Essential seed priming, temperature control, and tray seedling nursery techniques for vegetable and hybrid paddy farmers.',
    content: `High-quality seeds represent the cornerstone of a profitable agricultural yield. Ensuring optimal germination prevents costly re-sowing and guarantees uniform plant stands.

Step-by-step Germination Protocol:
1. Seed Priming: Soak seeds in lukewarm water with 2g/L carbendazim or bio-inoculant for 18-24 hours.
2. Incubation: Wrap soaked seeds in damp burlap or cotton cloth and place in a warm dark room (25°C-30°C) for 36-48 hours until sprouts emerge uniformly.
3. Media Preparation: Use a 50:50 mixture of fine vermicompost and coco peat in 104-cavity pro-trays.
4. Moisture Management: Water using fine mist sprayers twice daily; avoid flood watering.`,
    coverImage: 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=1200&q=80',
    images: [],
    videoUrl: '',
    documents: [],
    category: 'Seeds & Propagation',
    tags: ['hybrid-seeds', 'germination', 'nursery', 'paddy'],
    author: 'Rafsan Agro Technical Team',
    status: 'PUBLISHED',
    isFeatured: true,
    publishedAt: '2026-09-19T06:00:00.000Z',
    createdAt: '2026-09-19T06:00:00.000Z',
    updatedAt: '2026-09-19T06:00:00.000Z',
  },
  {
    id: 'art-4',
    title: 'Smart Drip Irrigation: Save 60% Water and Increase Produce Quality',
    slug: 'smart-drip-irrigation-farming',
    summary: 'How micro-irrigation and fertigation drastically reduce operational costs while delivering nutrients straight to plant root zones.',
    content: `Drip irrigation combined with soluble fertigation ensures optimal root-zone nourishment with minimal evaporation and runoff loss. 

Key advantages observed across pilot test plots:
- Water Savings: Uses 50% to 65% less water compared to traditional furrow or flood irrigation.
- Weed Suppression: Inter-row soil remains dry, suppressing broadleaf weed germination by 70%.
- Fertigation Precision: Water-soluble NPK fertilizers delivered in micro-doses directly to active feeding roots, improving nutrient uptake efficiency by 40%.`,
    coverImage: 'https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?auto=format&fit=crop&w=1200&q=80',
    images: [],
    videoUrl: 'https://www.youtube.com/watch?v=ScMzIvxBSi4',
    documents: [],
    category: 'Modern Farming',
    tags: ['drip-irrigation', 'water-saving', 'fertigation', 'smart-farming'],
    author: 'Kamrul Hasan (Irrigation Spec.)',
    status: 'PUBLISHED',
    isFeatured: false,
    publishedAt: '2026-09-10T11:00:00.000Z',
    createdAt: '2026-09-10T11:00:00.000Z',
    updatedAt: '2026-09-10T11:00:00.000Z',
  },
];
