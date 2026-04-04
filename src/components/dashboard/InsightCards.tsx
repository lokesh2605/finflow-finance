import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Lightbulb, PiggyBank } from 'lucide-react';
import { useFilteredTransactions } from '@/hooks/useFilteredTransactions';
import { useFinanceStore } from '@/store/financeStore';

const InsightCards = () => {
  const transactions = useFilteredTransactions();
  const allTransactions = useFinanceStore((s) => s.transactions);

  const insights = useMemo(() => {
    const result: { text: string; icon: typeof TrendingUp; type: 'positive' | 'negative' | 'neutral' }[] = [];

    // Food spending insight
    const foodSpend = transactions
      .filter((t) => t.category === 'food' && t.type === 'expense')
      .reduce((s, t) => s + t.amount, 0);
    const totalExpenses = transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    
    if (totalExpenses > 0) {
      const foodPercent = Math.round((foodSpend / totalExpenses) * 100);
      if (foodPercent > 30) {
        result.push({
          text: `Food is ${foodPercent}% of your spending — consider meal planning`,
          icon: TrendingDown,
          type: 'negative',
        });
      }
    }

    // Savings insight
    const income = transactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const savings = income - totalExpenses;
    if (savings > 0) {
      const savingsRate = Math.round((savings / income) * 100);
      result.push({
        text: `You're saving ${savingsRate}% of your income — ${savingsRate > 20 ? 'excellent' : 'room to grow'}`,
        icon: PiggyBank,
        type: savingsRate > 20 ? 'positive' : 'neutral',
      });
    }

    // Top category
    const categoryMap = new Map<string, number>();
    transactions.filter((t) => t.type === 'expense').forEach((t) => {
      categoryMap.set(t.category, (categoryMap.get(t.category) || 0) + t.amount);
    });
    const topCategory = [...categoryMap.entries()].sort((a, b) => b[1] - a[1])[0];
    if (topCategory) {
      result.push({
        text: `Your biggest expense category is ${topCategory[0]} at ₹${topCategory[1].toLocaleString('en-IN')}`,
        icon: Lightbulb,
        type: 'neutral',
      });
    }

    // Income trend
    if (income > 0) {
      result.push({
        text: `You earned ₹${income.toLocaleString('en-IN')} across ${transactions.filter((t) => t.type === 'income').length} transactions`,
        icon: TrendingUp,
        type: 'positive',
      });
    }

    return result;
  }, [transactions]);

  const typeStyles = {
    positive: 'border-success/20 bg-success/5',
    negative: 'border-destructive/20 bg-destructive/5',
    neutral: 'border-primary/20 bg-primary/5',
  };

  const iconStyles = {
    positive: 'text-success',
    negative: 'text-destructive',
    neutral: 'text-primary',
  };

  return (
    <section className="narrative-section">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <p className="text-muted-foreground font-medium text-sm tracking-widest uppercase mb-2 font-body">
          Insights
        </p>
        <h2 className="text-3xl md:text-4xl font-display mb-8">
          What the numbers say
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.map((insight, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className={`rounded-2xl border p-5 flex items-start gap-4 ${typeStyles[insight.type]}`}
            >
              <insight.icon className={`w-5 h-5 mt-0.5 shrink-0 ${iconStyles[insight.type]}`} />
              <p className="text-foreground/90 font-body leading-relaxed">{insight.text}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default InsightCards;
