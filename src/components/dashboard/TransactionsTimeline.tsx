import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Utensils, Car, ShoppingBag, Zap, Briefcase, Gamepad2, Heart, HelpCircle, Pencil, Trash2,
} from 'lucide-react';
import { useFilteredTransactions } from '@/hooks/useFilteredTransactions';
import { useFinanceStore, type TransactionCategory, type Transaction } from '@/store/financeStore';

const categoryIcons: Record<TransactionCategory, typeof Utensils> = {
  food: Utensils,
  transport: Car,
  shopping: ShoppingBag,
  bills: Zap,
  salary: Briefcase,
  freelance: Briefcase,
  entertainment: Gamepad2,
  health: Heart,
  other: HelpCircle,
};

const TransactionsTimeline = ({ onEdit }: { onEdit: (tx: Transaction) => void }) => {
  const transactions = useFilteredTransactions();
  const { role, deleteTransaction } = useFinanceStore();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const grouped = useMemo(() => {
    const sorted = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const groups = new Map<string, Transaction[]>();
    for (const tx of sorted) {
      const key = new Date(tx.date).toLocaleDateString('en-IN', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      });
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(tx);
    }
    return groups;
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
          Activity
        </p>
        <h2 className="text-3xl md:text-4xl font-display mb-8">
          Your transaction story
        </h2>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-border hidden md:block" />

          {Array.from(grouped.entries()).map(([dateLabel, txs], gi) => (
            <motion.div
              key={dateLabel}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: gi * 0.05, duration: 0.5 }}
              className="mb-8"
            >
              <div className="flex items-center gap-3 mb-4 md:pl-14">
                <div className="w-3 h-3 rounded-full bg-primary hidden md:block absolute left-[18px]" />
                <p className="text-sm text-muted-foreground font-body tracking-wide">{dateLabel}</p>
              </div>

              <div className="space-y-2 md:pl-14">
                {txs.map((tx) => {
                  const Icon = categoryIcons[tx.category];
                  const isIncome = tx.type === 'income';
                  return (
                    <div
                      key={tx.id}
                      className="group flex items-center justify-between bg-card rounded-xl px-4 py-3 border border-border hover:border-primary/20 transition-all duration-200"
                      onMouseEnter={() => setHoveredId(tx.id)}
                      onMouseLeave={() => setHoveredId(null)}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${isIncome ? 'bg-success/10' : 'bg-muted'}`}>
                          <Icon className={`w-4 h-4 ${isIncome ? 'text-success' : 'text-muted-foreground'}`} />
                        </div>
                        <div>
                          <p className="text-sm font-body text-foreground">{tx.title}</p>
                          <p className="text-xs text-muted-foreground capitalize font-body">{tx.category}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <p className={`text-sm font-body font-medium tabular-nums ${isIncome ? 'text-success' : 'text-foreground'}`}>
                          {isIncome ? '+' : '-'}₹{tx.amount.toLocaleString('en-IN')}
                        </p>

                        <AnimatePresence>
                          {role === 'admin' && hoveredId === tx.id && (
                            <motion.div
                              initial={{ opacity: 0, width: 0 }}
                              animate={{ opacity: 1, width: 'auto' }}
                              exit={{ opacity: 0, width: 0 }}
                              className="flex gap-1 overflow-hidden"
                            >
                              <button
                                onClick={() => onEdit(tx)}
                                className="p-1.5 rounded-lg hover:bg-secondary transition-colors"
                              >
                                <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
                              </button>
                              <button
                                onClick={() => deleteTransaction(tx.id)}
                                className="p-1.5 rounded-lg hover:bg-destructive/10 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5 text-destructive" />
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default TransactionsTimeline;
