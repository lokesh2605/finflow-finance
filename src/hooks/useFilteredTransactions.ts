import { useMemo } from 'react';
import { useFinanceStore, type Transaction, type FilterPeriod } from '@/store/financeStore';

export function useFilteredTransactions(): Transaction[] {
  const { transactions, filterPeriod } = useFinanceStore();

  return useMemo(() => {
    if (filterPeriod === 'all') return transactions;

    const now = new Date();
    const days = filterPeriod === '7d' ? 7 : filterPeriod === '30d' ? 30 : 90;
    const cutoff = new Date(now.getTime() - days * 86400000);

    return transactions.filter((t) => new Date(t.date) >= cutoff);
  }, [transactions, filterPeriod]);
}
