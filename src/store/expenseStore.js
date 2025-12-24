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
  fetchDashboardData: async (token, isBackground = false) => {
    // if bg is not refresh then only show loading 
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

      // New Data received from Server
      const newExpenses = expensesRes.data.data;
      const newStats = statsRes.data;

      // Current Data in Store
      const currentExpenses = get().expenses;
      const currentStats = get().stats;

      //Compare Strings to see if data changed
      const isDataSame = 
        JSON.stringify(newExpenses) === JSON.stringify(currentExpenses) &&
        JSON.stringify(newStats) === JSON.stringify(currentStats);

      // If data is exactly same, STOP here 
      if (isDataSame) {
        if (!isBackground) set({ loading: false }); 
        return; 
      }

      // Update only if data is different
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

      // UI Update 
      set((state) => ({
        expenses: state.expenses.filter((e) => e._id !== id),
      }));

      // refresh stats
      get().fetchDashboardData(token);

    } catch (err) {
      alert("Failed to delete");
    }
  },

  //  Download PDF Report
  downloadReport: async (month, year, token) => {
    set({ loading: true });
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/reports/pdf?month=${month}&year=${year}`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob',
      });

      // Create a URL for the PDF blob
      const url = window.URL.createObjectURL(new Blob([res.data]));

      // Create hidden link and click it
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `FinBot_Statement_${month}_${year}.pdf`);
      document.body.appendChild(link);
      link.click();

      // Cleanup
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);

      set({ loading: false });
      return true; // Success

    } catch (err) {
      console.error("PDF Download Error:", err);
      if (err.response && err.response.status === 404) {
        alert("No expenses found for this month.");
      } else {
        alert("Failed to download PDF report.");
      }
      set({ loading: false });
      return false;
    }
  }
}));