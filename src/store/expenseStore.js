import { create } from "zustand";
import axios from "axios";


const isDeepEqual = (obj1, obj2) => {
  if (obj1 === obj2) return true;
  
  if (typeof obj1 !== "object" || obj1 === null || typeof obj2 !== "object" || obj2 === null) {
    return false;
  }

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) return false;

  for (let key of keys1) {
    if (!keys2.includes(key) || !isDeepEqual(obj1[key], obj2[key])) {
      return false;
    }
  }

  return true;
};

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
    // Sirf tab loading dikhao jab user ne refresh kiya ho, background mein nahi
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

      const currentExpenses = get().expenses;
      const currentStats = get().stats;

      //  Compare 
      const isExpensesSame = isDeepEqual(newExpenses, currentExpenses);
      const isStatsSame = isDeepEqual(newStats, currentStats);

      //id data is same then stop here omly and dont update store
      if (isExpensesSame && isStatsSame) {
        if (!isBackground) set({ loading: false });
        return; 
      }

    //if data is changes then only update
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

      // Optimistic UI Update (Turant delete dikhao)
      set((state) => ({
        expenses: state.expenses.filter((e) => e._id !== id),
      }));

      // Background mein fresh data lao
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