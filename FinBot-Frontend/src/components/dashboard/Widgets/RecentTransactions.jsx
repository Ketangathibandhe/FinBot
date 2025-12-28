import React from 'react';
import { Trash2 } from "lucide-react";
import { BentoCard, getCategoryStyle } from './DashboardUI';

const RecentTransactions = ({ expenses, onDelete, token }) => {
  
  //create a copy of array first , the according to data sort for newest first
  const sortedExpenses = [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <BentoCard className="h-[450px]"> 
        <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
            <h3 className="text-lg font-semibold text-white">Recent Transactions</h3>
            <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Last {expenses.length} Records</p>
        </div>
        
        <div className="overflow-y-auto pr-2 custom-scrollbar space-y-2 h-[340px] w-full">
            {sortedExpenses.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-2">
                    <p>No transactions found.</p>
                </div>
            ) : (
               
                sortedExpenses.map((expense) => {
                    const catStyle = getCategoryStyle(expense.category);
                    
                    return (
                        <div key={expense._id} className="group flex items-center justify-between p-5 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 transition-all duration-200">
                            <div className="flex items-center gap-4">
                                <div className={`w-2.5 h-2.5 rounded-full ${catStyle.bg} ${catStyle.shadow}`}></div>
                                
                                <div>
                                    <p className="font-semibold text-gray-200 text-[15px]">{expense.title}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                    <p className="text-xs text-gray-500 font-medium">
                                        {new Date(expense.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                                    </p>
                                    <span className="text-[10px] text-gray-600">•</span>
                                    <p className="text-[10px] uppercase tracking-wide text-gray-500 font-bold bg-white/5 px-2 py-0.5 rounded-md">
                                        {expense.mode}
                                    </p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-5">
                                <span className="font-bold text-white text-base tracking-wide">- ₹{expense.amount.toLocaleString()}</span>
                                <button 
                                    onClick={() => {
                                        if(window.confirm("Delete this expense?")) onDelete(expense._id, token);
                                    }}
                                    className="bg-white/5 text-gray-400 hover:text-red-400 hover:bg-red-500/20 p-2.5 rounded-xl transition-all active:scale-95"
                                    title="Delete"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    );
                })
            )}
        </div>
    </BentoCard>
  );
};

export default RecentTransactions;