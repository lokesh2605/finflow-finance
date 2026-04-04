import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Role = 'viewer' | 'admin';

export type TransactionCategory = 'food' | 'transport' | 'shopping' | 'bills' | 'salary' | 'freelance' | 'entertainment' | 'health' | 'other';

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: 'income' | 'expense';
  category: TransactionCategory;
  date: string; // ISO string
}

export type FilterPeriod = '7d' | '30d' | '90d' | 'all';

interface FinanceState {
  role: Role;
  transactions: Transaction[];
  filterPeriod: FilterPeriod;
  monthlyBudget: number;
  setRole: (role: Role) => void;
  setFilterPeriod: (period: FilterPeriod) => void;
  setMonthlyBudget: (budget: number) => void;
  addTransaction: (tx: Omit<Transaction, 'id'>) => void;
  updateTransaction: (id: string, tx: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
}

const seedTransactions: Transaction[] = [
  { id: '1', title: 'Monthly Salary', amount: 85000, type: 'income', category: 'salary', date: '2026-03-31' },
  { id: '2', title: 'Freelance Project', amount: 15000, type: 'income', category: 'freelance', date: '2026-03-28' },
  { id: '3', title: 'Grocery Store', amount: 3200, type: 'expense', category: 'food', date: '2026-03-30' },
  { id: '4', title: 'Electricity Bill', amount: 2100, type: 'expense', category: 'bills', date: '2026-03-29' },
  { id: '5', title: 'Uber Rides', amount: 1800, type: 'expense', category: 'transport', date: '2026-03-28' },
  { id: '6', title: 'Netflix & Spotify', amount: 699, type: 'expense', category: 'entertainment', date: '2026-03-27' },
  { id: '7', title: 'New Sneakers', amount: 4500, type: 'expense', category: 'shopping', date: '2026-03-26' },
  { id: '8', title: 'Gym Membership', amount: 2000, type: 'expense', category: 'health', date: '2026-03-25' },
  { id: '9', title: 'Restaurant Dinner', amount: 2800, type: 'expense', category: 'food', date: '2026-03-24' },
  { id: '10', title: 'Consulting Fee', amount: 12000, type: 'income', category: 'freelance', date: '2026-03-22' },
  { id: '11', title: 'Swiggy Orders', amount: 1500, type: 'expense', category: 'food', date: '2026-03-21' },
  { id: '12', title: 'Metro Card Recharge', amount: 500, type: 'expense', category: 'transport', date: '2026-03-20' },
  { id: '13', title: 'Book Purchase', amount: 850, type: 'expense', category: 'shopping', date: '2026-03-18' },
  { id: '14', title: 'Monthly Salary', amount: 85000, type: 'income', category: 'salary', date: '2026-02-28' },
  { id: '15', title: 'Grocery Store', amount: 2900, type: 'expense', category: 'food', date: '2026-02-26' },
  { id: '16', title: 'Internet Bill', amount: 1200, type: 'expense', category: 'bills', date: '2026-02-24' },
];

export const useFinanceStore = create<FinanceState>()(
  persist(
    (set) => ({
      role: 'admin',
      transactions: seedTransactions,
      filterPeriod: '30d',
      monthlyBudget: 25000,
      setRole: (role) => set({ role }),
      setFilterPeriod: (period) => set({ filterPeriod: period }),
      setMonthlyBudget: (budget) => set({ monthlyBudget: budget }),
      addTransaction: (tx) =>
        set((s) => ({
          transactions: [{ ...tx, id: crypto.randomUUID() }, ...s.transactions],
        })),
      updateTransaction: (id, updates) =>
        set((s) => ({
          transactions: s.transactions.map((t) =>
            t.id === id ? { ...t, ...updates } : t
          ),
        })),
      deleteTransaction: (id) =>
        set((s) => ({
          transactions: s.transactions.filter((t) => t.id !== id),
        })),
    }),
    { name: 'finance-store' }
  )
);
