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
  },

  //  Download PDF Report
  downloadReport: async (month, year, token) => {
    set({ loading: true });
    try {
      const res = await axios.get(`http://localhost:5000/api/reports/pdf?month=${month}&year=${year}`, {
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
      if(err.response && err.response.status === 404) {
          alert("No expenses found for this month.");
      } else {
          alert("Failed to download PDF report.");
      }
      set({ loading: false });
      return false;
    }
  }
}));