import { X, Upload, Trash2, PlusCircle, Calendar, IndianRupee, Tag, ShoppingBag } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuthStore } from "../../store/authStore";

const AddExpenseDrawer = ({ open, onClose }) => {
  const token = useAuthStore((state) => state.token);
  const fileInputRef = useRef(null); 

  const [loading, setLoading] = useState(false);
  
  // form states 
  const [amount, setAmount] = useState("");
  const [title, setTitle] = useState(""); // item name
  const [category, setCategory] = useState("Food");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]); // default to today
  
  // file states
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  // close on escape key
  useEffect(() => {
    const esc = (e) => e.key === "Escape" && onClose();
    if (open) window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [open, onClose]);

  // reset form when drawer closes
  useEffect(() => {
    if (!open) {
        setAmount("");
        setTitle("");
        setCategory("Food");
        setDate(new Date().toISOString().split('T')[0]);
        handleDeleteFile(); // clear file
    }
  }, [open]);

  // handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file)); // show preview
    }
  };

  // remove selected file
  const handleDeleteFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    //either file OR (amount + item + category) is required
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

      // sending to backend
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

  if (!open) return null;

  return (
    <>
      {/* black background */}
      <div onClick={onClose} className="fixed inset-0 bg-black/50 z-40 transition-opacity" />

      {/* drawer container */}
      <div className="fixed bottom-0 left-0 z-50 w-full h-[85vh] bg-slate-900 border-t border-slate-800 rounded-t-2xl animate-slideUp flex flex-col">

        {/* header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 shrink-0">
          <h2 className="text-lg font-bold flex items-center gap-2">
             <PlusCircle size={20} className="text-blue-500"/> Add Expense
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-lg">
            <X size={18} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
            <form onSubmit={handleSubmit} className="space-y-6">
                
                {/*  upload receipt  */}
                <div>
                    <label className="block text-slate-300 text-sm font-medium mb-3">Upload Receipt</label>
                    
                    {/* hidden input */}
                    <input 
                        type="file" 
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                    />

                    <div className="flex items-center gap-4 p-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
                        <div className="w-16 h-16 shrink-0 bg-slate-700/80 rounded-lg flex items-center justify-center overflow-hidden border border-slate-600">
                            {previewUrl ? (
                                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <Upload size={24} className="text-slate-400" />
                            )}
                        </div>

                        {/* upload buttons */}
                        <div className="flex flex-col gap-2 flex-1">
                             <div className="flex gap-2">
                                <button 
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-4 py-2 rounded-lg transition flex-1"
                                >
                                    Choose Image
                                </button>
                                <button 
                                    type="button"
                                    onClick={handleDeleteFile}
                                    disabled={!selectedFile}
                                    className="text-red-400 border border-red-500/30 hover:bg-red-500/10 px-3 py-2 rounded-lg transition disabled:opacity-50"
                                >
                                    <Trash2 size={16} />
                                </button>
                             </div>
                             <p className="text-[10px] text-slate-500 text-center">AI will auto-detect amount & details</p>
                        </div>
                    </div>
                </div>

                {/*Or divider */}
                <div className="flex items-center justify-center relative py-2">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-slate-700"></span>
                    </div>
                    <span className="relative bg-slate-900 px-4 text-sm text-slate-500 font-medium">OR ADD MANUALLY</span>
                </div>

                {/* manual form  */}
                <div className={selectedFile ? "opacity-50 pointer-events-none" : ""}>
                    
                    
                    <div className="grid grid-cols-2 gap-4">
                        {/* amount field */}
                        <div>
                            <label className="block text-slate-300 text-sm font-medium mb-2">Amount</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <IndianRupee size={16} className="text-slate-400" />
                                </div>
                                <input 
                                    type="number" 
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="0"
                                    className="w-full pl-9 bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                />
                            </div>
                        </div>

                         {/* date field */}
                         <div>
                            <label className="block text-slate-300 text-sm font-medium mb-2">Date</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Calendar size={16} className="text-slate-400" />
                                </div>
                                <input 
                                    type="date" 
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="w-full pl-9 bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition dark:[color-scheme:dark]"
                                />
                            </div>
                        </div>
                    </div>

                    {/* item field */}
                    <div className="mt-4">
                        <label className="block text-slate-300 text-sm font-medium mb-2">Item Name</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <ShoppingBag size={16} className="text-slate-400" />
                            </div>
                            <input 
                                type="text" 
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g. Momos, Petrol, Movie"
                                className="w-full pl-9 bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition"
                            />
                        </div>
                    </div>

                    {/* category field */}
                    <div className="mt-4">
                         <label className="block text-slate-300 text-sm font-medium mb-2">Category</label>
                         <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Tag size={16} className="text-slate-400" />
                            </div>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full pl-9 bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition appearance-none"
                            >
                                {categories.map((cat) => (
                                    <option key={cat} value={cat} className="bg-slate-900 text-white">{cat}</option>
                                ))}
                            </select>
                         </div>
                    </div>
                </div>

            </form>
        </div>

         {/* footer button */}
         <div className="p-6 border-t border-slate-800 shrink-0 bg-slate-900">
             <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-lg shadow-lg active:scale-95 disabled:opacity-50 transition"
             >
                {loading ? "Saving..." : selectedFile ? "Scan & Add Receipt" : "Add Expense"}
             </button>
         </div>
      </div>
    </>
  );
};

export default AddExpenseDrawer;