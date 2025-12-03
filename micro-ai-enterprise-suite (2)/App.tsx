import React, { useState, useEffect } from 'react';
import { User, UserRole, AppView, SheetUserRow } from './types';
import { parseSheetData, mapRole, registerUser } from './services/authService';
import Dashboard from './components/Dashboard';
import AITools from './components/AITools';
import AdminView from './components/AdminView';
import ProductionTools from './components/ProductionTools';
import { 
  LayoutDashboard, 
  Bot, 
  Settings, 
  Film, 
  LogOut, 
  Moon, 
  Sun, 
  Menu, 
  X,
  Lock,
  User as UserIcon,
  Zap,
  UserPlus,
  ArrowRight
} from 'lucide-react';

// --- PSYCHOLOGICAL COLOR PALETTES ---
// Designed for eye comfort and mental flow states.
const VIBE_PALETTES = [
  {
    name: "Deep Serenity", // Blue/Indigo -> Lowers blood pressure, deep focus
    bgGradient: "from-blue-900/10 via-indigo-900/10 to-slate-900/10",
    blob1: "bg-indigo-600/20",
    blob2: "bg-blue-600/20",
    blob3: "bg-slate-500/20"
  },
  {
    name: "Forest Zen", // Emerald/Teal -> Reduces anxiety, restful for eyes
    bgGradient: "from-emerald-900/10 via-teal-900/10 to-green-900/10",
    blob1: "bg-emerald-500/20",
    blob2: "bg-teal-500/20",
    blob3: "bg-green-600/20"
  },
  {
    name: "Lavender Dream", // Purple/Pink -> Creativity and spiritual calm
    bgGradient: "from-purple-900/10 via-fuchsia-900/10 to-pink-900/10",
    blob1: "bg-purple-500/20",
    blob2: "bg-fuchsia-500/20",
    blob3: "bg-pink-500/20"
  },
  {
    name: "Midnight Focus", // Slate/Sky -> Neutralizes noise, pure clarity
    bgGradient: "from-slate-900/10 via-gray-900/10 to-zinc-900/10",
    blob1: "bg-sky-600/20",
    blob2: "bg-slate-500/20",
    blob3: "bg-indigo-400/20"
  }
];

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [darkMode, setDarkMode] = useState(true);
  const [vibeMode, setVibeMode] = useState(true); // Default ON
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentPaletteIndex, setCurrentPaletteIndex] = useState(0);

  // Auth Form State
  const [isRegistering, setIsRegistering] = useState(false);
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [authError, setAuthError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [authSuccessMsg, setAuthSuccessMsg] = useState('');

  // Theme Init
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // --- VIBE MODE AUTOMATIC ROTATION ---
  useEffect(() => {
    if (!vibeMode) return;

    // Change palette every 60 seconds (1 minute)
    const interval = setInterval(() => {
      setCurrentPaletteIndex((prev) => (prev + 1) % VIBE_PALETTES.length);
    }, 60000); 

    return () => clearInterval(interval);
  }, [vibeMode]);

  // --- SESSION TIMER (30 Minutes) ---
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (user) {
      const SESSION_DURATION = 30 * 60 * 1000;
      console.log(`Session started for ${user.username}. Auto-logout in 30 mins.`);
      timer = setTimeout(() => {
        alert("Session timed out (30 mins). Please log in again.");
        handleLogout();
      }, SESSION_DURATION);
    }
    return () => clearTimeout(timer);
  }, [user]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setAuthError('');
    setAuthSuccessMsg('');

    if (isRegistering) {
        if (!loginUser || !loginPass || !confirmPass) {
            setAuthError("All fields are required.");
            setIsProcessing(false);
            return;
        }
        if (loginPass !== confirmPass) {
            setAuthError("Passwords do not match.");
            setIsProcessing(false);
            return;
        }
        
        const success = registerUser(loginUser, loginPass);
        if (success) {
            setAuthSuccessMsg("Account created! Please log in.");
            setIsRegistering(false);
            setLoginPass('');
            setConfirmPass('');
        } else {
            setAuthError("Username already exists.");
        }
        setIsProcessing(false);

    } else {
        try {
          const sheetUsers: SheetUserRow[] = await parseSheetData();
          const foundUser = sheetUsers.find(
            u => u.username === loginUser && u.password === loginPass
          );
    
          if (!foundUser) {
            setAuthError('Invalid credentials');
            setIsProcessing(false);
            return;
          }
    
          if (foundUser.status !== 'active') {
            setAuthError('Account is inactive or suspended');
            setIsProcessing(false);
            return;
          }
    
          setUser({
            username: foundUser.username,
            role: mapRole(foundUser.role),
            isAuthenticated: true,
            lastLogin: new Date()
          });
          
        } catch (err) {
          setAuthError('Authentication Service Error');
        } finally {
          setIsProcessing(false);
        }
    }
  };

  const handleLogout = () => {
    setUser(null);
    setLoginUser('');
    setLoginPass('');
    setConfirmPass('');
    setAuthError('');
    setCurrentView(AppView.DASHBOARD);
  };

  const renderContent = () => {
    switch (currentView) {
      case AppView.DASHBOARD: return <Dashboard />;
      case AppView.AI_STUDIO: return <AITools />;
      case AppView.ADMIN_DB: return user?.role === UserRole.ADMIN ? <AdminView /> : <div className="text-center p-10 text-red-500">Access Denied</div>;
      case AppView.PRODUCTION_TOOLS: return <ProductionTools />;
      default: return <Dashboard />;
    }
  };

  // Get Current Palette
  const currentPalette = VIBE_PALETTES[currentPaletteIndex];

  // --- LOGIN / REGISTER SCREEN ---
  if (!user) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-gray-50 dark:bg-gray-900 transition-colors duration-[2000ms]">
        {/* Dynamic Vibe Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
           {/* Base Gradient Layer */}
           <div className={`absolute inset-0 bg-gradient-to-br transition-all duration-[3000ms] ${currentPalette.bgGradient}`}></div>
           
           {/* Animated Blobs */}
          <div className={`absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] rounded-full mix-blend-multiply filter blur-[80px] animate-blob transition-colors duration-[3000ms] ${currentPalette.blob1}`}></div>
          <div className={`absolute top-[-20%] right-[-10%] w-[70vw] h-[70vw] rounded-full mix-blend-multiply filter blur-[80px] animate-blob animation-delay-2000 transition-colors duration-[3000ms] ${currentPalette.blob2}`}></div>
          <div className={`absolute -bottom-32 left-20 w-[70vw] h-[70vw] rounded-full mix-blend-multiply filter blur-[80px] animate-blob animation-delay-4000 transition-colors duration-[3000ms] ${currentPalette.blob3}`}></div>
        </div>

        <div className="relative z-10 w-full max-w-md p-8">
            <div className="bg-white/20 dark:bg-black/40 backdrop-blur-xl border border-white/30 dark:border-gray-700 rounded-3xl shadow-2xl p-8 animate-fade-in transition-all duration-300">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-lg">
                         <Bot className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Micro AI</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                        {isRegistering ? 'Create User Account' : 'Enterprise Suite Login'}
                    </p>
                </div>

                {authSuccessMsg && (
                    <div className="mb-4 bg-green-500/20 text-green-600 dark:text-green-300 px-4 py-2 rounded-lg text-sm text-center border border-green-500/30">
                        {authSuccessMsg}
                    </div>
                )}

                <form onSubmit={handleAuth} className="space-y-4">
                    <div className="relative group">
                        <UserIcon className="absolute left-3 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                        <input 
                            type="text" 
                            placeholder="Username" 
                            value={loginUser}
                            onChange={e => setLoginUser(e.target.value)}
                            className="w-full bg-white/50 dark:bg-black/50 border border-gray-300 dark:border-gray-600 rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-gray-800 dark:text-white"
                            required
                        />
                    </div>
                    <div className="relative group">
                        <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                        <input 
                            type="password" 
                            placeholder="Password"
                            value={loginPass}
                            onChange={e => setLoginPass(e.target.value)}
                            className="w-full bg-white/50 dark:bg-black/50 border border-gray-300 dark:border-gray-600 rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-gray-800 dark:text-white"
                            required
                        />
                    </div>
                    
                    {isRegistering && (
                        <div className="relative group animate-fade-in">
                            <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                            <input 
                                type="password" 
                                placeholder="Confirm Password"
                                value={confirmPass}
                                onChange={e => setConfirmPass(e.target.value)}
                                className="w-full bg-white/50 dark:bg-black/50 border border-gray-300 dark:border-gray-600 rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-gray-800 dark:text-white"
                                required
                            />
                        </div>
                    )}

                    {authError && (
                        <div className="text-red-500 text-sm text-center bg-red-100 dark:bg-red-900/30 py-2 rounded-lg border border-red-200 dark:border-red-800">
                            {authError}
                        </div>
                    )}

                    <button 
                        type="submit" 
                        disabled={isProcessing}
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3.5 rounded-xl shadow-lg hover:shadow-indigo-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isProcessing 
                            ? 'Processing...' 
                            : (isRegistering ? <>Create Account <ArrowRight className="w-4 h-4"/></> : 'Authenticate')
                        }
                    </button>
                </form>

                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 flex flex-col items-center gap-3">
                    <button 
                        onClick={() => {
                            setIsRegistering(!isRegistering);
                            setAuthError('');
                            setAuthSuccessMsg('');
                        }}
                        className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                    >
                        {isRegistering ? 'Already have an account? Login' : 'New User? Register here'}
                    </button>
                    
                    <div className="text-xs text-gray-400">
                        <span>Status: <span className="text-green-500 font-semibold">System Online</span></span>
                    </div>
                </div>
            </div>
        </div>
      </div>
    );
  }

  // --- MAIN APP LAYOUT ---
  return (
    <div className={`min-h-screen w-full flex bg-gray-50 dark:bg-gray-900 transition-colors duration-300 relative overflow-x-hidden ${vibeMode ? 'overflow-hidden' : ''}`}>
       
       {/* Vibe Mode Background (Persistent) */}
       {vibeMode && (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className={`absolute top-0 left-0 w-full h-full bg-gradient-to-br transition-all duration-[3000ms] ${currentPalette.bgGradient}`}></div>
          
          <div className={`absolute top-[10%] left-[20%] w-[40vw] h-[40vw] rounded-full mix-blend-multiply filter blur-[100px] animate-blob transition-colors duration-[3000ms] ${currentPalette.blob1}`}></div>
          <div className={`absolute top-[40%] right-[20%] w-[35vw] h-[35vw] rounded-full mix-blend-multiply filter blur-[100px] animate-blob animation-delay-2000 transition-colors duration-[3000ms] ${currentPalette.blob2}`}></div>
          <div className={`absolute -bottom-32 left-[30%] w-[40vw] h-[40vw] rounded-full mix-blend-multiply filter blur-[100px] animate-blob animation-delay-4000 transition-colors duration-[3000ms] ${currentPalette.blob3}`}></div>
        </div>
       )}

      {/* Mobile Sidebar Toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 bg-white/80 dark:bg-black/80 backdrop-blur-md border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg text-gray-800 dark:text-white">
          {isSidebarOpen ? <X className="w-6 h-6"/> : <Menu className="w-6 h-6"/>}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-40 w-80 transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        bg-white/60 dark:bg-black/60 backdrop-blur-2xl border-r border-white/20 dark:border-gray-800
        flex flex-col shadow-2xl lg:shadow-none
      `}>
        <div className="p-6">
           {/* Logo Section - Increased spacing */}
           <div className="flex items-center gap-3 mb-10 mt-2 lg:mt-0 pl-2">
              <div className="w-12 h-12 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20 ring-1 ring-white/20">
                  <Bot className="w-7 h-7 text-white" />
              </div>
              <div className="flex flex-col">
                  <h1 className="text-2xl font-bold text-gray-800 dark:text-white leading-none tracking-tight">Micro AI</h1>
                  <span className="text-[10px] text-indigo-500 font-bold tracking-[0.2em] uppercase mt-1">Enterprise</span>
              </div>
           </div>

           {/* Navigation Cards */}
           <div className="space-y-3">
              <NavButton 
                active={currentView === AppView.DASHBOARD} 
                onClick={() => setCurrentView(AppView.DASHBOARD)} 
                icon={<LayoutDashboard className="w-5 h-5" />} 
                label="Dashboard" 
              />
              <NavButton 
                active={currentView === AppView.AI_STUDIO} 
                onClick={() => setCurrentView(AppView.AI_STUDIO)} 
                icon={<Bot className="w-5 h-5" />} 
                label="AI Studio" 
              />
              <NavButton 
                active={currentView === AppView.PRODUCTION_TOOLS} 
                onClick={() => setCurrentView(AppView.PRODUCTION_TOOLS)} 
                icon={<Film className="w-5 h-5" />} 
                label="Production Tools" 
              />
              {user.role === UserRole.ADMIN && (
                <NavButton 
                    active={currentView === AppView.ADMIN_DB} 
                    onClick={() => setCurrentView(AppView.ADMIN_DB)} 
                    icon={<Settings className="w-5 h-5" />} 
                    label="Admin Database" 
                />
              )}
           </div>
        </div>

        {/* Bottom Section - "Covered" Container */}
        <div className="mt-auto p-6">
            <div className="bg-white/40 dark:bg-black/40 backdrop-blur-md rounded-2xl p-4 border border-white/20 dark:border-gray-700/50 shadow-lg">
                
                {/* Toggles */}
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200/50 dark:border-gray-700/50">
                    <button 
                        onClick={() => setDarkMode(!darkMode)} 
                        className="p-2 hover:bg-white/50 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-600 dark:text-gray-400"
                        title="Toggle Theme"
                    >
                        {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </button>
                    <button 
                        onClick={() => setVibeMode(!vibeMode)} 
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${vibeMode ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-md' : 'bg-gray-200 dark:bg-gray-800 text-gray-500'}`}
                    >
                        <Zap className="w-3 h-3" /> Vibe {vibeMode ? 'On' : 'Off'}
                    </button>
                </div>

                {/* Profile */}
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-inner">
                        {user.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-800 dark:text-white truncate leading-tight">{user.username}</p>
                        <p className="text-[10px] text-gray-500 truncate uppercase font-semibold tracking-wide">{user.role}</p>
                    </div>
                </div>
                
                <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 py-2.5 rounded-xl transition-colors text-xs font-bold uppercase tracking-wider border border-transparent hover:border-red-200 dark:hover:border-red-900/30">
                    <LogOut className="w-4 h-4" /> Sign Out
                </button>
            </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 relative z-10 p-4 lg:p-8 overflow-y-auto h-screen custom-scrollbar">
         {/* Top Header mobile spacing */}
         <header className="mb-6 lg:mb-8 flex justify-between items-end mt-12 lg:mt-0 px-1">
             <div>
                 <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">{currentView.replace('_', ' ')}</h2>
                 <div className="flex items-center gap-2 text-sm">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    <p className="text-gray-500 dark:text-gray-400">System Operational</p>
                 </div>
             </div>
         </header>
         {renderContent()}
      </main>

    </div>
  );
};

// Helper Component for Navigation
const NavButton: React.FC<{active: boolean; onClick: () => void; icon: React.ReactNode; label: string}> = ({ active, onClick, icon, label }) => (
    <button 
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 font-medium group relative overflow-hidden ${
            active 
            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/20' 
            : 'text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-white/5 border border-transparent hover:border-white/10'
        }`}
    >
        {/* Active Indicator */}
        {active && <div className="absolute left-0 top-0 bottom-0 w-1 bg-white/30"></div>}
        
        <span className={`${active ? 'text-white' : 'text-gray-400 group-hover:text-indigo-500 transition-colors'}`}>
            {icon}
        </span>
        <span className="relative z-10">{label}</span>
    </button>
);

export default App;