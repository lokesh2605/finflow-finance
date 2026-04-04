import { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, Pencil, Check } from 'lucide-react';
import { useFinanceStore } from '@/store/financeStore';
import { useFilteredTransactions } from '@/hooks/useFilteredTransactions';
import AnimatedNumber from './AnimatedNumber';

const BudgetGoal = () => {
  const role = useFinanceStore((s) => s.role);
  const monthlyBudget = useFinanceStore((s) => s.monthlyBudget);
  const setMonthlyBudget = useFinanceStore((s) => s.setMonthlyBudget);
  const transactions = useFilteredTransactions();

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(monthlyBudget));

  const currentMonthExpenses = transactions
    .filter((t) => {
      if (t.type !== 'expense') return false;
      const d = new Date(t.date);
      const now = new Date();
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    })
    .reduce((s, t) => s + t.amount, 0);

  const pct = monthlyBudget > 0 ? Math.min((currentMonthExpenses / monthlyBudget) * 100, 100) : 0;
  const remaining = monthlyBudget - currentMonthExpenses;
  const overBudget = remaining < 0;

  const handleSave = () => {
    const val = parseInt(draft, 10);
    if (!isNaN(val) && val > 0) {
      setMonthlyBudget(val);
    }
    setEditing(false);
  };

  return (
    <section className="narrative-section pt-0">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <p className="text-muted-foreground font-medium text-sm tracking-widest uppercase mb-2 font-body">
          Budget
        </p>
        <h2 className="text-3xl md:text-4xl font-display mb-8">
          Monthly spending goal
        </h2>

        <div className="bg-card rounded-2xl border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Target className="w-5 h-5 text-primary opacity-70" />
              {editing ? (
                <div className="flex items-center gap-2">
                  <span className="text-foreground font-display text-xl">₹</span>
                  <input
                    type="number"
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                    className="bg-secondary border border-border rounded-lg px-3 py-1.5 text-foreground font-body w-32 text-lg focus:outline-none focus:ring-1 focus:ring-primary"
                    autoFocus
                  />
                  <button
                    onClick={handleSave}
                    className="p-1.5 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <span className="text-foreground font-display text-xl">
                  ₹{monthlyBudget.toLocaleString('en-IN')} / month
                </span>
              )}
            </div>
            {role === 'admin' && !editing && (
              <button
                onClick={() => {
                  setDraft(String(monthlyBudget));
                  setEditing(true);
                }}
                className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
              >
                <Pencil className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Progress bar */}
          <div className="relative h-3 w-full rounded-full bg-secondary overflow-hidden mb-4">
            <motion.div
              className={`h-full rounded-full ${overBudget ? 'bg-destructive' : 'bg-primary'}`}
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>

          <div className="flex items-center justify-between text-sm font-body">
            <span className="text-muted-foreground font-medium">
              Spent: <span className="text-foreground">₹<AnimatedNumber value={currentMonthExpenses} /></span>
            </span>
            <span className={overBudget ? 'text-destructive' : 'text-success'}>
              {overBudget
                ? `₹${Math.abs(remaining).toLocaleString('en-IN')} over budget`
                : `₹${remaining.toLocaleString('en-IN')} remaining`}
            </span>
          </div>

          <div className="mt-3 text-right text-xs text-muted-foreground font-body">
            {pct.toFixed(0)}% used
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default BudgetGoal;
