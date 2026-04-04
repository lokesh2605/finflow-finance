import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useFinanceStore, type Transaction, type TransactionCategory } from '@/store/financeStore';

interface TransactionModalProps {
  open: boolean;
  onClose: () => void;
  editTransaction?: Transaction | null;
}

const categories: TransactionCategory[] = [
  'food', 'transport', 'shopping', 'bills', 'salary', 'freelance', 'entertainment', 'health', 'other',
];

const TransactionModal = ({ open, onClose, editTransaction }: TransactionModalProps) => {
  const { addTransaction, updateTransaction } = useFinanceStore();
  const isEdit = !!editTransaction;

  const [title, setTitle] = useState(editTransaction?.title || '');
  const [amount, setAmount] = useState(editTransaction?.amount?.toString() || '');
  const [type, setType] = useState<'income' | 'expense'>(editTransaction?.type || 'expense');
  const [category, setCategory] = useState<TransactionCategory>(editTransaction?.category || 'other');
  const [date, setDate] = useState(editTransaction?.date || new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !amount) return;

    const data = { title, amount: Number(amount), type, category, date };

    if (isEdit && editTransaction) {
      updateTransaction(editTransaction.id, data);
    } else {
      addTransaction(data);
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* BACKDROP */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed inset-0 bg-background/70 backdrop-blur-md z-50"
            onClick={onClose}
          />

          {/* MODAL */}
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.96 }}
            transition={{ type: 'spring', damping: 22, stiffness: 260 }}
            className="fixed left-1/2 top-20 -translate-x-1/2 z-50 w-full max-w-md px-4"
          >
            <div className="bg-card border border-border rounded-2xl p-6 max-h-[85vh] overflow-y-auto scroll-smooth shadow-xl">

              {/* HEADER */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display text-xl">
                  {isEdit ? 'Edit Transaction' : 'New Transaction'}
                </h3>
                <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-secondary transition-colors">
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>

              {/* FORM */}
              <form onSubmit={handleSubmit} className="space-y-4">

                <div>
                  <label className="text-sm text-muted-foreground font-body mb-1 block">Title</label>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-muted border border-border rounded-xl px-4 py-2.5 text-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                    placeholder="e.g., Grocery Store"
                  />
                </div>

                <div>
                  <label className="text-sm text-muted-foreground font-body mb-1 block">Amount (₹)</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-muted border border-border rounded-xl px-4 py-2.5 text-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="text-sm text-muted-foreground font-body mb-1 block">Type</label>
                  <div className="flex gap-2">
                    {(['expense', 'income'] as const).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setType(t)}
                        className={`flex-1 py-2 rounded-xl text-sm font-body capitalize transition-all ${
                          type === t
                            ? t === 'income'
                              ? 'bg-success/20 text-success border border-success/30'
                              : 'bg-destructive/20 text-destructive border border-destructive/30'
                            : 'bg-muted text-muted-foreground border border-border'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm text-muted-foreground font-body mb-1 block">Category</label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setCategory(c)}
                        className={`px-3 py-1.5 rounded-full text-xs font-body capitalize transition-all ${
                          category === c
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground hover:bg-secondary'
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm text-muted-foreground font-body mb-1 block">Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-muted border border-border rounded-xl px-4 py-2.5 text-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-body font-medium text-sm hover:opacity-90 transition-all active:scale-[0.98]"
                >
                  {isEdit ? 'Save Changes' : 'Add Transaction'}
                </button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default TransactionModal;