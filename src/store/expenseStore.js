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

  // Fetch Data
  fetchDashboardData: async (token, isBackground = false) => {
    // Background refresh nahi hai toh loading dikhao
    if (!isBackground) {
      set({ loading: true });
    }

    try {
      const [expensesRes, statsRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/expense/user-expenses`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${import.meta.env.VITE_API_URL}/expense/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
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


      // get Current Data from store
      const currentExpenses = get().expenses;
      const currentStats = get().stats;

      //  Compare 
      const isDataSame =
        JSON.stringify(newExpenses) === JSON.stringify(currentExpenses) &&
        JSON.stringify(newStats) === JSON.stringify(currentStats);

      // if same then stop here 
      if (isDataSame) {
        if (!isBackground) set({ loading: false });
        return; 
      }

      // if data changes then update
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
      await axios.delete(`${import.meta.env.VITE_API_URL}/expense/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      set((state) => ({
        expenses: state.expenses.filter((e) => e._id !== id),
      }));

      get().fetchDashboardData(token, true); 

    } catch (err) {
      alert("Failed to delete");
    }
  },

  // Download PDF Report
  downloadReport: async (month, year, token) => {
    set({ loading: true });
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/reports/pdf?month=${month}&year=${year}`, {
        headers: { Authorization: `Bearer ${token}` },
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
      return false;
    }
  }
}));