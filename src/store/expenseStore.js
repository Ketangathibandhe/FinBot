import { create } from "zustand";
import axios from "axios";

export const useExpenseStore = create((set, get) => ({
  expenses: [],
  stats: {
    categoryStats: [],
    dailyStats: [],
    totalExpense: 0,
  },
  loading: false,

  // Fetch Data (Expenses + Stats)
  fetchDashboardData: async (token) => {
    set({ loading: true });
    try {
      const [expensesRes, statsRes] = await Promise.all([
        axios.get("http://localhost:5000/api/expense/user-expenses", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://localhost:5000/api/expense/stats", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      set({
        expenses: expensesRes.data.data,
        stats: statsRes.data,
        loading: false,
      });
    } catch (err) {
      console.error("Dashboard Error:", err);
      set({ loading: false });
    }
  },

  // Delete Action
  deleteExpense: async (id, token) => {
    try {
        await axios.delete(`http://localhost:5000/api/expense/delete/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        
        // UI Update 
        set((state) => ({
            expenses: state.expenses.filter((e) => e._id !== id),
        }));
        
        // refresh stats
        get().fetchDashboardData(token);
        
    } catch (err) {
        alert("Failed to delete");
    }
  }
}));