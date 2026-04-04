import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useFilteredTransactions } from '@/hooks/useFilteredTransactions';
import type { TransactionCategory } from '@/store/financeStore';

const CATEGORY_CONFIG: Record<TransactionCategory, { label: string; color: string }> = {
  food: { label: 'Food', color: 'hsl(15, 80%, 55%)' },
  transport: { label: 'Transport', color: 'hsl(210, 70%, 55%)' },
  shopping: { label: 'Shopping', color: 'hsl(280, 60%, 55%)' },
  bills: { label: 'Bills', color: 'hsl(45, 85%, 55%)' },
  salary: { label: 'Salary', color: 'hsl(152, 60%, 45%)' },
  freelance: { label: 'Freelance', color: 'hsl(170, 55%, 45%)' },
  entertainment: { label: 'Entertainment', color: 'hsl(330, 65%, 55%)' },
  health: { label: 'Health', color: 'hsl(120, 50%, 45%)' },
  other: { label: 'Other', color: 'hsl(220, 10%, 50%)' },
};

const SpendingDonut = () => {
  const transactions = useFilteredTransactions();

  const data = useMemo(() => {
    const categoryTotals = new Map<TransactionCategory, number>();
    for (const tx of transactions) {
      if (tx.type === 'expense') {
        categoryTotals.set(tx.category, (categoryTotals.get(tx.category) || 0) + tx.amount);
      }
    }
    return Array.from(categoryTotals.entries())
      .map(([cat, amount]) => ({
        name: CATEGORY_CONFIG[cat].label,
        value: amount,
        color: CATEGORY_CONFIG[cat].color,
      }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  const total = data.reduce((s, d) => s + d.value, 0);

  if (!data.length) return null;

  return (
    <section className="narrative-section pt-0">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <p className="text-muted-foreground font-medium text-sm tracking-widest uppercase mb-2 font-body">
          Breakdown
        </p>
        <h2 className="text-3xl md:text-4xl font-display mb-8">
          Where your money went
        </h2>

        <div className="bg-card rounded-2xl border border-border p-6">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-full md:w-1/2 max-w-[280px]">
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={110}
                    paddingAngle={3}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {data.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: 'hsl(0, 0%, 100%)',
                      border: '1px solid hsl(220, 14%, 16%)',
                      borderRadius: '12px',
                      fontFamily: 'DM Sans',
                      color: 'hsl(40, 10%, 92%)',
                    }}
                    formatter={(value: number) => [`₹${value.toLocaleString('en-IN')}`, '']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="flex-1 w-full space-y-3">
              {data.map((item) => {
                const pct = ((item.value / total) * 100).toFixed(1);
                return (
                  <div key={item.name} className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm font-body text-foreground flex-1">{item.name}</span>
                    <span className="text-sm text-muted-foreground font-body tabular-nums">
                      ₹{item.value.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs text-muted-foreground font-body w-12 text-right tabular-nums">
                      {pct}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default SpendingDonut;
