import { create } from "zustand";
import api from "../lib/api";
import toast from "react-hot-toast";

export const useExpenseStore = create((set, get) => ({
  expenses: [],
  stats: {
    categoryStats: [],
    dailyStats: [],
    totalExpense: 0,
  },
  loading: false,

  // Fetch Data
  fetchDashboardData: async (token, isBackground = false) => {
    // Background refresh nahi hai toh loading dikhao
    if (!isBackground) {
      set({ loading: true });
    }

    try {
      const [expensesRes, statsRes] = await Promise.all([
        api.get("/expense/user-expenses"),
        api.get("/expense/stats"),
      ]);

      const newExpenses = expensesRes.data.data;
      const newStats = statsRes.data;

      // Category Data Sort (A-Z)
      if (newStats.categoryStats && Array.isArray(newStats.categoryStats)) {
        newStats.categoryStats.sort((a, b) => (a._id || "").localeCompare(b._id || ""));
      }

      // Daily Data Sort (Date wise)
      if (newStats.dailyStats && Array.isArray(newStats.dailyStats)) {
        newStats.dailyStats.sort((a, b) => (a._id || "").localeCompare(b._id || ""));
      }
      
      // Expenses List Sort (Latest first) 
      if (newExpenses && Array.isArray(newExpenses)) {
         newExpenses.sort((a, b) => (a._id || "").localeCompare(b._id || ""));
      }


      // Get Current Data from store
      const currentExpenses = get().expenses;
      const currentStats = get().stats;

      //  Compare 
      const isDataSame =
        JSON.stringify(newExpenses) === JSON.stringify(currentExpenses) &&
        JSON.stringify(newStats) === JSON.stringify(currentStats);

      // If same then stop here 
      if (isDataSame) {
        if (!isBackground) set({ loading: false });
        return; 
      }

      // If data changes then update
      set({
        expenses: newExpenses,
        stats: newStats,
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
      await api.delete(`/expense/delete/${id}`);

      set((state) => ({
        expenses: state.expenses.filter((e) => e._id !== id),
      }));

      get().fetchDashboardData(token, true); 

    } catch (err) {
      toast.error("Failed to delete expense");
    }
  },

  // Edit Action
  editExpense: async (id, updateData, token) => {
    try {
      const res = await api.put(`/expense/edit/${id}`, updateData);
      
      // Update local state immediately
      set((state) => ({
        expenses: state.expenses.map((e) => 
          e._id === id ? res.data.data : e
        ),
      }));

      // Refresh stats in background
      get().fetchDashboardData(token, true);
      
      return true;
    } catch (err) {
      toast.error("Failed to update expense");
      return false;
    }
  },

  // Download PDF Report
  downloadReport: async (month, year, token) => {
    set({ loading: true });
    try {
      const res = await api.get(`/reports/pdf?month=${month}&year=${year}`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `FinBot_Statement_${month}_${year}.pdf`);
      document.body.appendChild(link);
      link.click();
      
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);

      set({ loading: false });
      return true;

    } catch (err) {
      console.error("PDF Download Error:", err);
      set({ loading: false });
      toast.error("Failed to download report. No data found for this period.");
      return false;
    }
  }
}));