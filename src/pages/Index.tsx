import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFinanceStore, type Transaction } from '@/store/financeStore';
import HeroHeader from '@/components/dashboard/HeroHeader';
import SummaryCards from '@/components/dashboard/SummaryCards';
import TrendChart from '@/components/dashboard/TrendChart';
import SpendingDonut from '@/components/dashboard/SpendingDonut';
import BudgetGoal from '@/components/dashboard/BudgetGoal';
import InsightCards from '@/components/dashboard/InsightCards';
import TransactionsTimeline from '@/components/dashboard/TransactionsTimeline';
import TransactionModal from '@/components/dashboard/TransactionModal';
import RoleSwitcher from '@/components/dashboard/RoleSwitcher';
import Toggle from "@/components/toggle";

const Index = () => {
  const role = useFinanceStore((s) => s.role);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTx, setEditTx] = useState<Transaction | null>(null);

  const handleEdit = (tx: Transaction) => {
    setEditTx(tx);
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
    setEditTx(null);
  };

  return (
  <div className="min-h-screen bg-background">
    {/* Top bar */}
    <nav className="sticky top-0 z-40 backdrop-blur-xl bg-background/70 border-b border-border">
      <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
        <p className="font-display text-lg">Finflow</p>

        <div className="flex items-center gap-2">
          <Toggle />
          <RoleSwitcher />
        </div>
      </div>
    </nav>
      {/* Narrative content */}
      <main className="max-w-4xl mx-auto px-6">
        <HeroHeader />
        <SummaryCards />
        <TrendChart />
        <SpendingDonut />
        <BudgetGoal />
        <InsightCards />
        <TransactionsTimeline onEdit={handleEdit} />
      </main>

      {/* FAB for admin */}
      <AnimatePresence>
        {role === 'admin' && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            onClick={() => setModalOpen(true)}
            className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:opacity-90 transition-opacity z-40"
          >
            <Plus className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      <TransactionModal open={modalOpen} onClose={handleClose} editTransaction={editTx} />
    </div>
  );
};

export default Index;
