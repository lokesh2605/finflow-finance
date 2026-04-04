import { useFinanceStore, type Role } from '@/store/financeStore';
import { ChevronDown, Eye, Shield } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const RoleSwitcher = () => {
  const { role, setRole } = useFinanceStore();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const roles: { value: Role; label: string; icon: typeof Eye }[] = [
    { value: 'viewer', label: 'Viewer', icon: Eye },
    { value: 'admin', label: 'Admin', icon: Shield },
  ];

  const current = roles.find((r) => r.value === role)!;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-secondary-foreground text-sm font-body hover:bg-secondary/80 transition-colors"
      >
        <current.icon className="w-4 h-4" />
        {current.label}
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-44 bg-popover border border-border rounded-xl overflow-hidden shadow-xl z-50"
          >
            {roles.map((r) => (
              <button
                key={r.value}
                onClick={() => { setRole(r.value); setOpen(false); }}
                className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm font-body transition-colors ${
                  role === r.value ? 'bg-primary/10 text-primary' : 'text-popover-foreground hover:bg-secondary'
                }`}
              >
                <r.icon className="w-4 h-4" />
                {r.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RoleSwitcher;
