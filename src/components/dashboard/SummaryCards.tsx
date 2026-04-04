import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { useFilteredTransactions } from '@/hooks/useFilteredTransactions';
import AnimatedNumber from './AnimatedNumber';

const SummaryCards = () => {
  const transactions = useFilteredTransactions();

  const { balance, income, expenses } = useMemo(() => {
    const inc = transactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const exp = transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    return { balance: inc - exp, income: inc, expenses: exp };
  }, [transactions]);

  const cards = [
    { label: 'Net Balance', value: balance, icon: Wallet, color: 'text-primary' },
    { label: 'Total Income', value: income, icon: TrendingUp, color: 'text-success' },
    { label: 'Total Expenses', value: expenses, icon: TrendingDown, color: 'text-destructive' },
  ];

  return (
    <section className="narrative-section pt-0">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {cards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="group bg-card rounded-2xl p-6 border border-border hover:border-primary/30 transition-all duration-300 hover:glow-gold"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-muted-foreground font-medium text-sm font-body tracking-wide">{card.label}</span>
              <card.icon className={`w-5 h-5 ${card.color} opacity-60 group-hover:opacity-100 transition-opacity`} />
            </div>
            <p className={`text-3xl font-display ${card.color}`}>
              ₹<AnimatedNumber value={card.value} />
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default SummaryCards;
