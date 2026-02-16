import React, { useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Car,
    Users,
    Calendar,
    MessageSquare,
    LogOut,
    Shield,
    ShieldAlert,
    UserCheck,
    Settings,
    Bell,
    Sun,
    Moon,
    TrendingUp,
    Menu,
    Newspaper
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

const AdminLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, loading, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();

    useEffect(() => {
        if (!loading) {
            if (!user || user.role !== 'admin') {
                navigate('/admin/login');
            }
        }
    }, [user, loading, navigate]);

    const handleLogout = () => {
        logout();
        navigate('/admin/login');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-slate-50 dark:bg-slate-950">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!user || user.role !== 'admin') return null;

    const sidebarItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
        { icon: TrendingUp, label: 'Analytics', path: '/admin/analytics' },
        { icon: Car, label: 'Cars', path: '/admin/cars' },
        { icon: Calendar, label: 'Bookings', path: '/admin/bookings' },
        { icon: Users, label: 'Users', path: '/admin/users' },
        { icon: UserCheck, label: 'Drivers', path: '/admin/drivers' },
        { icon: ShieldAlert, label: 'Blacklist', path: '/admin/blacklist' },
        { icon: MessageSquare, label: 'Messages', path: '/admin/messages' },
        { icon: Newspaper, label: 'News Management', path: '/admin/news' },
        { icon: Settings, label: 'Settings', path: '/admin/settings' },
    ];

    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

    return (
        <div className="admin-panel flex h-screen bg-[#f8fafc] dark:bg-slate-950 overflow-hidden relative">
            {/* Sidebar Overlay for Mobile */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed lg:relative inset-y-0 left-0 w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 
                flex flex-col shadow-xl z-50 transition-transform duration-300 transform
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="p-6">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                                <Shield className="w-6 h-6 text-primary-foreground" />
                            </div>
                            <div>
                                <span className="text-xl font-display font-black tracking-tight text-slate-900 dark:text-white uppercase italic">CityCars</span>
                                <p className="text-[10px] font-bold text-primary tracking-[0.2em] uppercase">Admin Control</p>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="lg:hidden"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <LogOut className="w-5 h-5 rotate-180" />
                        </Button>
                    </div>

                    <nav className="space-y-1">
                        {sidebarItems.map((item) => {
                            const isActive = location.pathname.startsWith(item.path);
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                                        ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-[1.02]'
                                        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                                        }`}
                                >
                                    <item.icon className={`w-5 h-5 ${isActive ? 'text-primary-foreground' : 'group-hover:text-primary transition-colors'}`} />
                                    <span className="font-semibold text-sm">{item.label}</span>
                                    {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-foreground" />}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className="mt-auto p-6 space-y-4">
                    <Separator className="dark:bg-slate-800" />
                    <div className="flex items-center gap-3 px-2 mb-4">
                        <Avatar className="h-10 w-10 border-2 border-primary/20">
                            <AvatarImage src={user.avatar || (user.name ? `https://ui-avatars.com/api/?name=${user.name}&background=random` : undefined)} />
                            <AvatarFallback>{user.name ? user.name.charAt(0) : 'A'}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user.name}</p>
                            <p className="text-xs text-slate-500 truncate">{user.email}</p>
                        </div>
                    </div>

                    <Button
                        variant="ghost"
                        className="w-full justify-start gap-3 text-slate-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/10 transition-all rounded-xl py-6"
                        onClick={handleLogout}
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="font-bold">Logout Session</span>
                    </Button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden z-30">
                {/* Header */}
                <header className="h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 md:px-8 z-20">
                    <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="lg:hidden shrink-0"
                            onClick={() => setIsMobileMenuOpen(true)}
                        >
                            <Menu className="w-6 h-6" />
                        </Button>
                        <h2 className="text-sm md:text-lg font-bold text-slate-900 dark:text-white truncate">
                            {sidebarItems.find(i => location.pathname.startsWith(i.path))?.label || 'Overview'}
                        </h2>
                    </div>

                    <div className="flex items-center gap-2 md:gap-4 shrink-0">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                            onClick={toggleTheme}
                        >
                            {theme === 'light' ? <Moon className="w-4 h-4 md:w-5 h-5" /> : <Sun className="w-4 h-4 md:w-5 h-5" />}
                        </Button>
                        <Button variant="ghost" size="icon" className="rounded-full relative" onClick={() => navigate('/admin/messages')}>
                            <Bell className="w-4 h-4 md:w-5 h-5" />
                            <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full border border-white dark:border-slate-900" />
                        </Button>
                        <Button variant="ghost" size="icon" className="rounded-full" onClick={() => navigate('/admin/settings')}>
                            <Settings className="w-4 h-4 md:w-5 h-5" />
                        </Button>
                    </div>
                </header>

                <div className="flex-1 overflow-auto p-4 md:p-8 custom-scrollbar">
                    <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;

