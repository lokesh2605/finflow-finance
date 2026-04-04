import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { useFilteredTransactions } from '@/hooks/useFilteredTransactions';

const TrendChart = () => {
  const transactions = useFilteredTransactions();

  const chartData = useMemo(() => {
    const sorted = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const dailyMap = new Map<string, number>();

    let runningBalance = 0;
    for (const tx of sorted) {
      runningBalance += tx.type === 'income' ? tx.amount : -tx.amount;
      dailyMap.set(tx.date, runningBalance);
    }

    return Array.from(dailyMap.entries()).map(([date, balance]) => ({
      date: new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
      balance,
    }));
  }, [transactions]);

  return (
    <section className="narrative-section">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <p className="text-muted-foreground font-medium text-sm tracking-widest uppercase mb-2 font-body">
          The Trend
        </p>
        <h2 className="text-3xl md:text-4xl font-display mb-8">
          How your balance moved
        </h2>

        <div className="bg-card rounded-2xl border border-border p-6 overflow-hidden">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(43, 96%, 56%)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(43, 96%, 56%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(220, 10%, 50%)', fontSize: 12, fontFamily: 'DM Sans' }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(220, 10%, 50%)', fontSize: 12, fontFamily: 'DM Sans' }}
                tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{
                  background: 'hsl(220, 16%, 10%)',
                  border: '1px solid hsl(220, 14%, 16%)',
                  borderRadius: '12px',
                  fontFamily: 'DM Sans',
                  color: 'hsl(40, 10%, 92%)',
                }}
                formatter={(value: number) => [`₹${value.toLocaleString('en-IN')}`, 'Balance']}
              />
              <Area
                type="monotone"
                dataKey="balance"
                stroke="hsl(43, 96%, 56%)"
                strokeWidth={2}
                fill="url(#balanceGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </section>
  );
};

export default TrendChart;
