import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useFinanceStore } from '@/store/financeStore';
import { useFilteredTransactions } from '@/hooks/useFilteredTransactions';

const HeroHeader = () => {
  const { filterPeriod, setFilterPeriod } = useFinanceStore();
  const transactions = useFilteredTransactions();

  const { totalIncome, totalExpenses, savings } = useMemo(() => {
    const inc = transactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const exp = transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    return { totalIncome: inc, totalExpenses: exp, savings: inc - exp };
  }, [transactions]);

  const periods: { label: string; value: typeof filterPeriod }[] = [
    { label: '7 days', value: '7d' },
    { label: '30 days', value: '30d' },
    { label: '90 days', value: '90d' },
    { label: 'All', value: 'all' },
  ];

  const savingsPositive = savings >= 0;

  return (
    <section className="narrative-section pb-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <p className="text-muted-foreground font-medium text-sm tracking-widest uppercase mb-4 font-body">
          Your Financial Story
        </p>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-display leading-tight mb-6">
          {savingsPositive ? (
            <>
              You saved{' '}
              <span className="text-[#00AB08]">₹{savings.toLocaleString('en-IN')}</span>{' '}
              this period
            </>
          ) : (
            <>
              You overspent by{' '}
              <span className="text-destructive">₹{Math.abs(savings).toLocaleString('en-IN')}</span>{' '}
              this period
            </>
          )}
        </h1>
        <p className="text-muted-foreground font-medium text-lg md:text-xl max-w-2xl font-body">
          Earned ₹{totalIncome.toLocaleString('en-IN')} · Spent ₹{totalExpenses.toLocaleString('en-IN')}
        </p>
      </motion.div>

      <div className="flex gap-2 mt-8">
        {periods.map((p) => (
          <button
            key={p.value}
            onClick={() => setFilterPeriod(p.value)}
            className={`px-4 py-2 rounded-full text-sm font-body transition-all duration-200 ${
              filterPeriod === p.value
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>
    </section>
  );
};

export default HeroHeader;
