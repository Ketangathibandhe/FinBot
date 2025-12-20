import { X, Upload, Trash2, PlusCircle, Calendar, IndianRupee, Tag, ShoppingBag, ChevronDown } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuthStore } from "../../store/authStore";

const AddExpenseDrawer = ({ open, onClose }) => {
  const token = useAuthStore((state) => state.token);
  const fileInputRef = useRef(null); 

  const [loading, setLoading] = useState(false);
  
  const [amount, setAmount] = useState("");
  const [title, setTitle] = useState(""); 
  const [category, setCategory] = useState("Food");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]); 
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    const esc = (e) => e.key === "Escape" && onClose();
    if (open) window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) {
        setAmount("");
        setTitle("");
        setCategory("Food");
        setDate(new Date().toISOString().split('T')[0]);
        handleDeleteFile(); 
    }
  }, [open]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file)); 
    }
  };

  const handleDeleteFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedFile && (!amount || !title)) {
        toast.error("Please enter Amount & Item Name OR Upload a Receipt");
        return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      if(amount) formData.append("amount", amount);
      if(title) formData.append("title", title); 
      if(category) formData.append("category", category);
      if(date) formData.append("date", date);
      if(selectedFile) formData.append("receipt", selectedFile);

      await axios.post(
        "http://localhost:5000/api/expense/add", 
        formData,
        {
          withCredentials: true,
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Expense added successfully!");
      onClose();

    } catch (err) {
      console.error(err);
      toast.error("Failed to add expense");
    } finally {
      setLoading(false);
    }
  };

  const categories = ["Food", "Travel", "Fuel", "Shopping", "Entertainment", "Bills", "Health", "Education", "Groceries", "General"];

  return (
    <>
      <div 
        onClick={onClose} 
        className={`fixed inset-0 bg-black/60 backdrop-blur-md z-40 transition-opacity duration-300 ${
            open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`} 
      />

      <div className={`
        fixed inset-x-0 bottom-0 z-50 w-full h-[85vh] 
        bg-[#0F1219] border-t border-white/10 
        rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.6)] 
        transform transition-transform duration-300 ease-out flex flex-col
        ${open ? "translate-y-0 pointer-events-auto" : "translate-y-[120%] pointer-events-none"}
      `}>

        <div className="w-full flex justify-center pt-3 pb-1 shrink-0">
            <div className="w-12 h-1.5 bg-linear-to-r from-blue-300 to-purple-500 rounded-full"></div>
        </div>

        <div className="flex items-center justify-between px-6 py-4 shrink-0">
          <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl border border-white/5">
                    <PlusCircle size={24} className="text-blue-400" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-white tracking-tight">Add Expense</h2>
                    <p className="text-xs text-gray-500 font-medium mt-0.5">Manually or via Receipt Scan</p>
                </div>
          </div>
          <button onClick={onClose} className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition text-gray-400 hover:text-white border border-transparent hover:border-white/10">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
            <form onSubmit={handleSubmit} className="space-y-6 max-w-lg mx-auto">
                
                <div className="space-y-3">
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider ml-1">Receipt Scan (AI)</label>
                    
                    <input 
                        type="file" 
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                    />

                    {!selectedFile ? (
                        <div 
                            onClick={() => fileInputRef.current?.click()}
                            className="border border-dashed border-white/20 bg-[#1A1F2E]/30 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-blue-500/50 hover:bg-[#1A1F2E] transition-all group"
                        >
                            <div className="p-3 bg-blue-500/10 rounded-full text-blue-400 group-hover:scale-110 transition-transform">
                                <Upload size={24} />
                            </div>
                            <div className="text-center">
                                <p className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors">Tap to Upload Receipt</p>
                                <p className="text-xs text-gray-500 mt-1">AI will auto-detect amount & details</p>
                            </div>
                        </div>
                    ) : (
                        <div className="relative bg-[#1A1F2E] border border-white/10 rounded-2xl p-3 flex items-center gap-4 animate-fadeIn">
                            <div className="w-16 h-16 shrink-0 rounded-lg overflow-hidden border border-white/10 bg-black">
                                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-white truncate">{selectedFile.name}</p>
                                <p className="text-xs text-blue-400 mt-0.5">Ready to scan</p>
                            </div>
                            <button 
                                type="button"
                                onClick={handleDeleteFile}
                                className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-center relative py-2 opacity-60">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-white/10"></span>
                    </div>
                    <span className="relative bg-[#0F1219] px-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest">OR ADD MANUALLY</span>
                </div>

                <div className={`space-y-5 transition-opacity duration-300 ${selectedFile ? "opacity-30 pointer-events-none" : "opacity-100"}`}>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider ml-1">Amount</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-500 group-hover:text-blue-400 transition-colors">
                                    <IndianRupee size={16} />
                                </div>
                                <input 
                                    type="number" 
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="0"
                                    className="w-full pl-10 bg-[#1A1F2E] border border-white/10 text-white font-medium rounded-xl py-3.5 px-4 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-gray-600 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider ml-1">Date</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-500 group-hover:text-blue-400 transition-colors">
                                    <Calendar size={16} />
                                </div>
                                <input 
                                    type="date" 
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="w-full pl-10 bg-[#1A1F2E] border border-white/10 text-white font-medium rounded-xl py-3.5 px-4 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all dark:[color-scheme:dark] text-sm"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider ml-1">Item Name</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-500 group-hover:text-blue-400 transition-colors">
                                <ShoppingBag size={16} />
                            </div>
                            <input 
                                type="text" 
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g. Starbucks, Uber, Movie"
                                className="w-full pl-10 bg-[#1A1F2E] border border-white/10 text-white font-medium rounded-xl py-3.5 px-4 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-gray-600"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                         <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider ml-1">Category</label>
                         <div className="relative group">
                            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-500 group-hover:text-blue-400 transition-colors">
                                    <Tag size={16} />
                            </div>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full pl-10 bg-[#1A1F2E] border border-white/10 text-white font-medium rounded-xl py-3.5 px-4 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all appearance-none cursor-pointer"
                            >
                                {categories.map((cat) => (
                                    <option key={cat} value={cat} className="bg-[#0F1219] text-white py-2">{cat}</option>
                                ))}
                            </select>
                            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-600">
                                <ChevronDown size={16} />
                            </div>
                         </div>
                    </div>
                </div>

            </form>
        </div>

         <div className="p-3 border-t border-white/5 shrink-0 bg-[#0F1219]">
            <div className="max-w-lg mx-auto">
                 <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 text-white font-bold text-base shadow-lg shadow-blue-500/25 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3 border border-white/10"
                 >
                    {loading ? (
                        <>
                             <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                             {selectedFile ? "Scanning..." : "Saving..."}
                        </>
                    ) : (
                        selectedFile ? "Scan & Add Receipt" : "Add Expense"
                    )}
                 </button>
            </div>
         </div>
      </div>
    </>
  );
};

export default AddExpenseDrawer;