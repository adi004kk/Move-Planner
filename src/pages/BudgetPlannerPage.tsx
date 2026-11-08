import React, { useState } from 'react';
import {
  Calculator,
  Plus,
  Trash2,
  DollarSign,
  PieChart,
  CheckCircle,
  Circle,
  TrendingDown,
  TrendingUp,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { useTravel } from '../context/TravelContext';
import { ExpenseItem, Currency } from '../types/travel';
import { SEOHead } from '../components/seo/SEOHead';


export const BudgetPlannerPage: React.FC = () => {
  const { expenses, addExpense, updateExpense, deleteExpense, currency, setCurrency, formatPrice } = useTravel();

  const [totalTripBudget, setTotalTripBudget] = useState<number>(45000);
  const [numberOfTravellers, setNumberOfTravellers] = useState<number>(2);
  const [numberOfDays, setNumberOfDays] = useState<number>(4);

  // New expense form modal state
  const [isAddingExpense, setIsAddingExpense] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<ExpenseItem['category']>('Accommodation');
  const [newEstimated, setNewEstimated] = useState<number>(3000);
  const [newActual, setNewActual] = useState<number>(0);

  const categories: ExpenseItem['category'][] = [
    'Accommodation',
    'Transport',
    'Food',
    'Activities',
    'Shopping',
    'Insurance',
    'Emergency',
    'Miscellaneous'
  ];

  // Totals calculations
  const totalEstimatedCost = expenses.reduce((sum, e) => sum + e.estimatedAmount, 0);
  const totalActualCost = expenses.reduce((sum, e) => sum + e.actualAmount, 0);
  const totalPaid = expenses.filter(e => e.paid).reduce((sum, e) => sum + (e.actualAmount || e.estimatedAmount), 0);
  const remainingBudget = totalTripBudget - totalEstimatedCost;
  const utilizationPercentage = Math.min(100, Math.round((totalEstimatedCost / Math.max(1, totalTripBudget)) * 100));

  const perPersonCost = Math.round(totalEstimatedCost / Math.max(1, numberOfTravellers));
  const perDayCost = Math.round(totalEstimatedCost / Math.max(1, numberOfDays));

  // Category subtotals
  const categoryTotals = categories.map(cat => {
    const sumEst = expenses.filter(e => e.category === cat).reduce((s, e) => s + e.estimatedAmount, 0);
    const sumAct = expenses.filter(e => e.category === cat).reduce((s, e) => s + e.actualAmount, 0);
    return {
      category: cat,
      estimated: sumEst,
      actual: sumAct,
      percentage: totalEstimatedCost > 0 ? Math.round((sumEst / totalEstimatedCost) * 100) : 0
    };
  }).filter(c => c.estimated > 0 || c.actual > 0);

  const handleCreateExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addExpense({
      title: newTitle.trim(),
      category: newCategory,
      estimatedAmount: Number(newEstimated),
      actualAmount: Number(newActual),
      paid: false
    });

    setNewTitle('');
    setNewEstimated(1000);
    setNewActual(0);
    setIsAddingExpense(false);
  };

  return (
    <div className="space-y-8 pb-20">
      <SEOHead
        title="Trip Budget Planner & Expense Calculator"
        description="Estimate and manage your travel costs with MovePlanner. Calculate daily expenses, lodging, flights, meals, and track actual spending against budgets."
        keywords="trip budget planner, travel cost calculator, vacation budget tracker, MovePlanner"
      />
      
      {/* Top Banner */}

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">
            Finance & Cost Tracking
          </span>
          <h1 className="font-serif text-3xl font-extrabold text-slate-900 mt-1">
            Trip Budget Calculator
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">
            Track flight bookings, hotel deposits, food expenses, and activity passes. Compare estimated versus actual spends.
          </p>
        </div>

        <button
          onClick={() => setIsAddingExpense(true)}
          className="px-5 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md shadow-sky-600/30 transition-all hover:scale-105 active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Expense</span>
        </button>
      </div>

      {/* Target Budget Inputs & Summary Dashboard */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        
        {/* Controls row: Trip Budget, Travellers, Days */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-6 border-b border-slate-800">
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Total Target Budget
            </label>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/15">
              <span className="text-sky-400 font-bold">{currency}</span>
              <input
                type="number"
                value={totalTripBudget}
                onChange={(e) => setTotalTripBudget(Number(e.target.value))}
                className="w-full bg-transparent font-bold text-white text-base outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Number of Travellers
            </label>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/15">
              <input
                type="number"
                min="1"
                max="20"
                value={numberOfTravellers}
                onChange={(e) => setNumberOfTravellers(Number(e.target.value))}
                className="w-full bg-transparent font-bold text-white text-base outline-none"
              />
              <span className="text-slate-400 text-xs">persons</span>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Trip Duration
            </label>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/15">
              <input
                type="number"
                min="1"
                max="60"
                value={numberOfDays}
                onChange={(e) => setNumberOfDays(Number(e.target.value))}
                className="w-full bg-transparent font-bold text-white text-base outline-none"
              />
              <span className="text-slate-400 text-xs">days</span>
            </div>
          </div>
        </div>

        {/* Big Numbers Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Total Estimated</span>
            <span className="text-2xl font-extrabold text-white mt-1 block">{formatPrice(totalEstimatedCost)}</span>
            <span className="text-[10px] text-sky-400">{utilizationPercentage}% of budget utilized</span>
          </div>

          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Total Actual Spent</span>
            <span className="text-2xl font-extrabold text-amber-300 mt-1 block">{formatPrice(totalActualCost)}</span>
            <span className="text-[10px] text-slate-400">Logged real expenses</span>
          </div>

          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Cost Per Person</span>
            <span className="text-2xl font-extrabold text-white mt-1 block">{formatPrice(perPersonCost)}</span>
            <span className="text-[10px] text-slate-400">Across {numberOfTravellers} travelers</span>
          </div>

          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Cost Per Day</span>
            <span className="text-2xl font-extrabold text-white mt-1 block">{formatPrice(perDayCost)}</span>
            <span className="text-[10px] text-slate-400">Across {numberOfDays} travel days</span>
          </div>
        </div>

        {/* Progress Bar of Budget Utilization */}
        <div className="space-y-1.5 pt-2">
          <div className="flex justify-between text-xs text-slate-300">
            <span>Budget Utilization</span>
            <span className={remainingBudget < 0 ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
              {remainingBudget >= 0 ? `${formatPrice(remainingBudget)} remaining` : `Exceeded by ${formatPrice(Math.abs(remainingBudget))}`}
            </span>
          </div>
          <div className="w-full bg-white/20 h-2.5 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                remainingBudget < 0 ? 'bg-rose-500' : 'bg-emerald-400'
              }`}
              style={{ width: `${Math.min(100, utilizationPercentage)}%` }}
            />
          </div>
        </div>

      </div>

      {/* Category Breakdown Bars */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
        <h2 className="font-serif text-xl font-bold text-slate-900">Expense Distribution by Category</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categoryTotals.map(cat => (
            <div key={cat.category} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-slate-800">{cat.category}</span>
                <span className="font-semibold text-slate-500">{cat.percentage}%</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Est: {formatPrice(cat.estimated)}</span>
                <span className="text-slate-700 font-bold">Act: {formatPrice(cat.actual)}</span>
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-sky-600 h-full rounded-full"
                  style={{ width: `${cat.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Itemized Expenses Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-xl font-bold text-slate-900">Itemized Expenses</h2>
          <span className="text-xs text-slate-400">{expenses.length} records</span>
        </div>

        <div className="space-y-3">
          {expenses.map((expense) => (
            <div
              key={expense.id}
              className="p-4 rounded-2xl border border-slate-200/80 hover:border-slate-300 bg-white transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={() => updateExpense(expense.id, { paid: !expense.paid })}
                  className="text-slate-400 hover:text-emerald-600 transition-colors"
                  title={expense.paid ? 'Mark unpaid' : 'Mark paid'}
                >
                  {expense.paid ? (
                    <CheckCircle className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                  ) : (
                    <Circle className="w-5 h-5" />
                  )}
                </button>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-600">
                      {expense.category}
                    </span>
                    {expense.paid && (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700">
                        Paid
                      </span>
                    )}
                  </div>
                  <h3 className="font-serif font-bold text-slate-900 text-sm mt-0.5">{expense.title}</h3>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-6 text-xs border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                <div className="text-left sm:text-right">
                  <span className="text-slate-400 text-[10px] block">Estimated</span>
                  <span className="font-bold text-slate-800">{formatPrice(expense.estimatedAmount)}</span>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-slate-400 text-[10px] block">Actual</span>
                  <span className="font-bold text-amber-600">
                    {expense.actualAmount > 0 ? formatPrice(expense.actualAmount) : '—'}
                  </span>
                </div>

                <button
                  onClick={() => deleteExpense(expense.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                  title="Remove expense"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Expense Modal */}
      {isAddingExpense && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-4 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="font-serif font-bold text-slate-900 text-xl">
              Add Trip Expense
            </h3>

            <form onSubmit={handleCreateExpense} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Expense Title</label>
                <input
                  type="text"
                  placeholder="e.g. Flight tickets, Hotel booking deposit..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-semibold text-slate-800"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-semibold text-slate-700"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Estimated Cost (INR)</label>
                  <input
                    type="number"
                    value={newEstimated}
                    onChange={(e) => setNewEstimated(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-semibold text-slate-800"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Actual Paid (INR)</label>
                  <input
                    type="number"
                    value={newActual}
                    onChange={(e) => setNewActual(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-semibold text-slate-800"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddingExpense(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold shadow-md"
                >
                  Add to Budget
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
