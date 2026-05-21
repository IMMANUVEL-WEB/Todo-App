import { useState, useEffect } from 'react';
import axios from 'axios';
import { PlusCircle, Trash2, CheckCircle, Circle, Loader2, Sparkles, AlertCircle, LayoutList, Edit3, X, Save, Sun, Moon } from 'lucide-react';
import './App.css';

const API_URL = `${import.meta.env.VITE_API_URL}/todos`

function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(API_URL);
      setTodos(response.data);
    } catch (err) {
      console.error('Error fetching todos:', err);
      setError('Failed to connect to the server.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setAdding(true);
    try {
      const response = await axios.post(API_URL, {
        Title: title,
        Description: description,
        Completed: false,
      });
      setTodos([response.data, ...todos]);
      setTitle('');
      setDescription('');
    } catch (err) {
      console.error('Error adding todo:', err);
    } finally {
      setAdding(false);
    }
  };

  const toggleComplete = async (todo) => {
    try {
      setTodos(todos.map((t) => (t.id === todo.id ? { ...t, Completed: !t.Completed } : t)));
      
      await axios.put(`${API_URL}/${todo.id}`, {
        Title: todo.Title,
        Description: todo.Description,
        Completed: !todo.Completed,
      });
    } catch (err) {
      console.error('Error updating todo:', err);
      fetchTodos(); // Revert
    }
  };

  const startEditing = (todo) => {
    setEditingId(todo.id);
    setEditTitle(todo.Title);
    setEditDescription(todo.Description);
  };

  const saveEdit = async (todo) => {
    if (!editTitle.trim() || !editDescription.trim()) return;
    try {
      setTodos(todos.map((t) => (t.id === todo.id ? { ...t, Title: editTitle, Description: editDescription } : t)));
      setEditingId(null);
      
      await axios.put(`${API_URL}/${todo.id}`, {
        Title: editTitle,
        Description: editDescription,
        Completed: todo.Completed,
      });
    } catch (err) {
      console.error('Error saving edit:', err);
      fetchTodos(); // Revert
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle('');
    setEditDescription('');
  };

  const handleDelete = async (id) => {
    try {
      setTodos(todos.filter((t) => t.id !== id));
      await axios.delete(`${API_URL}/${id}`);
    } catch (err) {
      console.error('Error deleting todo:', err);
      fetchTodos();
    }
  };

  return (
    <div className="min-h-screen bg-transparent flex justify-center items-center p-0 sm:p-4 lg:p-8 relative selection:bg-indigo-500/30 transition-colors duration-500">
      
      {/* Animated Background Orbs */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-600/30 rounded-full mix-blend-screen filter blur-[100px] animate-blob"></div>
        <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-cyan-600/30 rounded-full mix-blend-screen filter blur-[100px] animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-[40rem] h-[40rem] bg-indigo-600/20 rounded-full mix-blend-screen filter blur-[120px] animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-7xl w-full min-h-screen lg:min-h-0 lg:h-[90vh] glass-panel rounded-none sm:rounded-[2.5rem] flex flex-col lg:flex-row lg:overflow-hidden shadow-indigo-900/20 animate-fade-in relative z-10">
        
        {/* LEFT COLUMN - Branding, 3D Character, Form */}
        <div className="w-full lg:w-5/12 p-6 lg:p-10 flex flex-col border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-700/50 relative overflow-y-auto custom-scrollbar group lg:shrink-0 lg:h-full transition-colors duration-500">
          
          <div className="relative z-10 shrink-0">
            <div className="flex justify-between items-start mb-2">
              <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-indigo-400 via-purple-400 to-cyan-400 flex items-center gap-3">
                <Sparkles className="w-8 h-8 text-indigo-400" />
                Task Master's
              </h1>
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2.5 rounded-xl transition-colors duration-300 bg-slate-200/50 text-slate-700 hover:bg-slate-300 dark:bg-slate-800/50 dark:text-yellow-400 dark:hover:bg-slate-700 backdrop-blur-md"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-sm lg:text-base mb-6 max-w-sm transition-colors duration-300">
              Level up your productivity with a beautiful, rich interface designed to keep you focused.
            </p>
          </div>

          {/* 3D Mascot Image with floating animation */}
          <div className="flex-1 flex items-center justify-center relative min-h-[150px] shrink-0 my-4">
            <div className="absolute w-40 h-40 bg-indigo-500/20 rounded-full filter blur-[50px] animate-pulse"></div>
            <img 
              src="/mascot.png" 
              alt="3D Mascot" 
              className="w-40 lg:w-52 h-auto object-contain animate-float drop-shadow-2xl z-10"
              style={{ filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.5))' }}
            />
          </div>

          <div className="relative z-10 mt-auto shrink-0">
            <form onSubmit={handleAddTodo} className="space-y-4">
              <div className="space-y-3">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Task Title..."
                  className="w-full glass-input rounded-xl px-5 py-4 text-slate-100 placeholder-slate-500 outline-none transition-all duration-300"
                  required
                />
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Description..."
                  rows="2"
                  className="w-full glass-input rounded-xl px-5 py-3 text-slate-100 placeholder-slate-500 outline-none transition-all duration-300 resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={adding || !title.trim() || !description.trim()}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold rounded-xl px-6 py-4 flex items-center justify-center gap-2 transition-all duration-300 shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5 active:translate-y-0"
              >
                {adding ? <Loader2 className="w-5 h-5 animate-spin" /> : <PlusCircle className="w-5 h-5" />}
                {adding ? 'Creating...' : 'Create New Task'}
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT COLUMN - Task List */}
        <div className="w-full lg:w-7/12 p-6 sm:p-8 lg:p-12 flex flex-col min-h-[60vh] lg:h-full bg-slate-100/50 dark:bg-slate-900/20 lg:overflow-hidden transition-colors duration-500">
          
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 flex items-center gap-3 transition-colors duration-300">
              <LayoutList className="w-6 h-6 text-purple-400" />
              Your Tasks
            </h2>
            <div className="px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-medium text-sm flex items-center gap-2 shadow-[0_0_15px_rgba(99,102,241,0.1)]">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
              {todos.length} {todos.length === 1 ? 'Task' : 'Tasks'}
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-start gap-3 animate-slide-up">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold">Connection Error</h3>
                <p className="text-sm opacity-90">{error}</p>
              </div>
            </div>
          )}

          <div className="flex-1 overflow-y-visible lg:overflow-y-auto pr-2 space-y-4 custom-scrollbar pb-10">
            {loading ? (
              <div className="h-full flex flex-col items-center justify-center space-y-4">
                <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
                <p className="text-slate-600 dark:text-slate-400 animate-pulse transition-colors duration-300">Loading tasks...</p>
              </div>
            ) : todos.length === 0 && !error ? (
              <div className="h-full flex flex-col items-center justify-center text-center px-6 animate-slide-up">
                <div className="w-32 h-32 mb-6 relative">
                  <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 rounded-full animate-blob"></div>
                  <div className="absolute inset-2 glass-panel rounded-full flex items-center justify-center">
                    <Sparkles className="w-12 h-12 text-indigo-500 dark:text-indigo-400" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2 transition-colors duration-300">You're all caught up!</h3>
                <p className="text-slate-600 dark:text-slate-400 max-w-sm transition-colors duration-300">No active tasks right now. Take a break, or add a new task to keep the momentum going.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {todos.map((todo, index) => (
                  <div
                    key={todo.id}
                    className={`group relative glass-panel rounded-2xl p-5 transition-all duration-500 hover:-translate-y-1 hover:shadow-indigo-500/20 animate-slide-up`}
                    style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/0 to-indigo-500/0 group-hover:from-indigo-500/5 group-hover:to-purple-500/5 rounded-2xl transition-all duration-500"></div>
                    
                    <div className="relative flex items-start gap-4">
                      {editingId === todo.id ? (
                        <div className="flex-1 w-full space-y-3">
                          <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="w-full glass-input rounded-lg px-4 py-2 text-lg font-bold transition-all duration-300"
                            placeholder="Edit Title..."
                          />
                          <textarea
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                            className="w-full glass-input rounded-lg px-4 py-2 text-sm transition-all duration-300 resize-none"
                            placeholder="Edit Description..."
                            rows="2"
                          />
                          <div className="flex justify-end gap-2 mt-2">
                            <button
                              onClick={cancelEdit}
                              className="px-4 py-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-200 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800 transition-colors flex items-center gap-2"
                            >
                              <X className="w-4 h-4" /> Cancel
                            </button>
                            <button
                              onClick={() => saveEdit(todo)}
                              disabled={!editTitle.trim() || !editDescription.trim()}
                              className="px-4 py-2 rounded-lg bg-indigo-600/80 hover:bg-indigo-500 text-white transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(79,70,229,0.2)] disabled:opacity-50"
                            >
                              <Save className="w-4 h-4" /> Save
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <button
                            onClick={() => toggleComplete(todo)}
                            className={`mt-1 flex-shrink-0 transition-all duration-300 hover:scale-110 ${
                              todo.Completed 
                                ? 'text-cyan-500 dark:text-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.3)] dark:drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]' 
                                : 'text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400'
                            }`}
                          >
                            {todo.Completed ? (
                              <CheckCircle className="w-7 h-7" />
                            ) : (
                              <Circle className="w-7 h-7" />
                            )}
                          </button>
                          
                          <div className="flex-1 min-w-0">
                            <h3 className={`text-lg font-bold truncate transition-all duration-300 ${
                              todo.Completed ? 'text-slate-400 dark:text-slate-500 line-through' : 'text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-200'
                            }`}>
                              {todo.Title}
                            </h3>
                            <p className={`mt-2 text-sm leading-relaxed transition-all duration-300 ${
                              todo.Completed ? 'text-slate-500 dark:text-slate-600' : 'text-slate-600 dark:text-slate-400'
                            }`}>
                              {todo.Description}
                            </p>
                          </div>

                          <div className="flex flex-col sm:flex-row gap-1 transition-all duration-300">
                            <button
                              onClick={() => startEditing(todo)}
                              className="p-2.5 text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-500/10 rounded-xl transition-all duration-300 backdrop-blur-md border border-transparent hover:border-indigo-500/20"
                              aria-label="Edit task"
                            >
                              <Edit3 className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDelete(todo.id)}
                              className="p-2.5 text-slate-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-300 backdrop-blur-md border border-transparent hover:border-red-500/20"
                              aria-label="Delete task"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
