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
