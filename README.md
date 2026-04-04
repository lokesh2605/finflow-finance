# FinFlow — Personal Finance Dashboard

## Problem Statement

Managing personal finances is often confusing due to cluttered interfaces and lack of clear insights. Most existing tools focus on raw data rather than helping users understand their financial behavior, making it difficult to track spending patterns, savings, and overall financial health.

## Solution

FinFlow is designed to simplify personal finance tracking through a clean and intuitive dashboard. It transforms raw transaction data into meaningful insights, allowing users to quickly understand where their money is going and how well they are managing it.

The interface prioritizes clarity, highlights key financial metrics, and reduces unnecessary complexity to improve decision-making.

## Key Features

- Add, edit, and delete transactions  
- Categorize income and expenses  
- Real-time calculation of savings and balance  
- Insight-driven summaries (spending patterns, top categories)  
- Time-based filtering (7 days, 30 days, etc.)  
- Light and dark mode support  
- Smooth animations and transitions  
- Responsive and modern UI  

## Design Approach

The design focuses on simplicity and usability:

- Important financial data is placed above the fold for quick access  
- Visual hierarchy is used to guide attention to key metrics  
- Colors are carefully chosen to maintain readability in both light and dark modes  
- Subtle animations improve user experience without distraction  
- Typography and spacing are optimized for clarity and consistency  

## Tech Stack

- React (TypeScript)  
- Tailwind CSS  
- Framer Motion  
- Zustand (state management)  
- Lucide Icons  

## Project Structure

c:/Users/Lokesh/Downloads/story-finance-flow-main/
│  
├── src/                          # Source code (React/TS app)
│   ├── App.tsx                   # Root component (routing, theme, providers)
│   ├── main.tsx                  # Entry point (renders App)
│   ├── index.css                 # Global CSS (Tailwind base)
│   └── vite-env.d.ts             # Vite TypeScript declarations
│
│   ├── components/               # Reusable UI components
│   │   ├── NavLink.tsx           # Navigation links
│   │   ├── dashboard/            # Finance dashboard widgets
│   │   │   ├── HeroHeader.tsx    # Header/title section
│   │   │   ├── SummaryCards.tsx  # KPI summary cards
│   │   │   ├── SpendingDonut.tsx # Expense category pie chart
│   │   │   ├── BudgetGoal.tsx    # Monthly budget tracker + admin edit btn
│   │   │   ├── RoleSwitcher.tsx  # Admin/Viewer role toggle (shows admin btn)
│   │   │   ├── TrendChart.tsx    # Spending trends over time
│   │   │   ├── TransactionsTimeline.tsx # Tx list/timeline (admin hover)
│   │   │   ├── AnimatedNumber.tsx # Animated counters
│   │   │   └── TransactionModal.tsx # Add/edit transactions modal
│   │   └── ui/                   # Shadcn/UI primitive components (Button, Card, etc.)
│   │       ├── button.tsx        # Reusable buttons
│   │       ├── card.tsx          # Cards/layouts
│   │       ├── chart.tsx         # Recharts wrapper
│   │       ├── dialog.tsx        # Modals/popups
│   │       └── ... (50+ primitives: table, tabs, toast, etc.)
│
│   ├── pages/                    # Page-level routes/views
│   │   ├── Index.tsx             # Main dashboard (contains admin FAB button)
│   │   └── NotFound.tsx          # 404 page
│
│   ├── store/                    # Zustand state management
│   │   └── financeStore.ts       # Role (admin/viewer), transactions, budget
│
│   ├── hooks/                    # Custom React hooks
│   │   ├── use-mobile.tsx        # Mobile detection
│   │   ├── use-toast.ts          # Toast notifications
│   │   └── useFilteredTransactions.ts # Tx filtering by period/category
│
│   └── lib/                      # Utilities
│       └── utils.ts              # cn() className helper (Tailwind)
│
├── package.json                  # Dependencies (React, Vite, Tailwind, Shadcn, Framer Motion, Zustand)
├── tailwind.config.ts            # Tailwind config (themes, plugins)
├── vite.config.ts                # Vite bundler config (React, TS, dev server)
├── tsconfig*.json                # TypeScript configs
├── postcss.config.js             # PostCSS/Tailwind processing
├── eslint.config.js              # ESLint rules
├── README.md                     # Project docs
└── ... (git, locks)
 

## Installation

1. Clone the repository  
   git clone https://github.com/your-username/finflow.git  

2. Navigate to the project directory  
   cd finflow  

3. Install dependencies  
   npm install  

4. Run the development server  
   npm run dev  

## Future Improvements

- Advanced data visualization (charts and graphs)  
- Budget planning and alerts  
- AI-based financial insights  
- Backend integration for persistent data storage  
- User authentication and multi-device sync  

## Author

Lokesh Gadda  
UI/UX Designer, web & AI/ML Developer  
