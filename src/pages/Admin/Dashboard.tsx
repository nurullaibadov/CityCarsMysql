import React, { useEffect, useState } from 'react';
import api from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Car,
    Users,
    Calendar,
    MessageSquare,
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight,
    DollarSign,
    Clock,
    CheckCircle2,
    AlertCircle,
    Truck,
    RefreshCw
} from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    Legend
} from 'recharts';
import { Button } from '@/components/ui/button';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        cars: 0,
        bookings: 0,
        users: 0,
        messages: 0,
        drivers: 0,
        revenue: 0,
        todayBookings: 0,
        todayUsers: 0,
        todayMessages: 0,
        pendingBookings: 0
    });

    const [analytics, setAnalytics] = useState([]);
    const [activities, setActivities] = useState([]);
    const [topVehicles, setTopVehicles] = useState([]);
    const [carTypeStats, setCarTypeStats] = useState([]);
    const [statusStats, setStatusStats] = useState([]);
    const [userGrowth, setUserGrowth] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchDashboardData = async (showRefreshIndicator = false) => {
        if (showRefreshIndicator) setRefreshing(true);
        try {
            const [statsRes, analyticsRes, activitiesRes, vehiclesRes, carTypesRes, statusRes, growthRes] = await Promise.all([
                api.get('/admin/stats'),
                api.get('/admin/analytics'),
                api.get('/admin/activities?limit=5'),
                api.get('/admin/top-vehicles'),
                api.get('/admin/stats/car-types'),
                api.get('/admin/stats/status-distribution'),
                api.get('/admin/stats/user-growth')
            ]);

            setStats(statsRes.data);
            setAnalytics(analyticsRes.data);
            setActivities(activitiesRes.data);
            setTopVehicles(vehiclesRes.data);
            setCarTypeStats(carTypesRes.data);
            setStatusStats(statusRes.data);
            setUserGrowth(growthRes.data);
        } catch (error) {
            console.error("Failed to fetch dashboard data", error);
        } finally {
            setLoading(false);
            if (showRefreshIndicator) setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();

        // Auto-refresh every 30 seconds
        const interval = setInterval(() => {
            fetchDashboardData();
        }, 30000);

        return () => clearInterval(interval);
    }, []);

    const cards = [
        {
            title: 'Total Revenue',
            value: `$${stats.revenue?.toLocaleString() || 0}`,
            icon: DollarSign,
            trend: '+12%',
            positive: true,
            color: 'bg-emerald-500',
            subtitle: 'All-time earnings'
        },
        {
            title: 'Total Bookings',
            value: stats.bookings,
            icon: Calendar,
            trend: `+${stats.todayBookings} today`,
            positive: true,
            color: 'bg-blue-500',
            subtitle: `${stats.pendingBookings} pending`
        },
        {
            title: 'Active Users',
            value: stats.users,
            icon: Users,
            trend: `+${stats.todayUsers} today`,
            positive: true,
            color: 'bg-indigo-500',
            subtitle: 'Registered users'
        },
        {
            title: 'Total Fleet',
            value: stats.cars,
            icon: Car,
            trend: `${stats.drivers} drivers`,
            positive: true,
            color: 'bg-purple-500',
            subtitle: 'Available vehicles'
        },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-3">
                    <RefreshCw className="w-8 h-8 animate-spin text-primary" />
                    <p className="text-muted-foreground">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-10">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                        Dashboard Overview
                    </h1>
                    <p className="text-slate-500 mt-1">
                        Real-time insights and analytics for CityCars
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        onClick={() => fetchDashboardData(true)}
                        disabled={refreshing}
                        variant="outline"
                        className="flex items-center gap-2"
                    >
                        <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                        {refreshing ? 'Refreshing...' : 'Refresh'}
                    </Button>
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-medium">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <span>Last 7 Days</span>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, idx) => (
                    <Card
                        key={idx}
                        className="border-none shadow-xl shadow-slate-200/50 dark:shadow-none bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl overflow-hidden group hover:scale-[1.02] transition-all duration-300"
                    >
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-3 rounded-xl ${card.color} text-white shadow-lg shadow-current/20`}>
                                    <card.icon className="w-6 h-6" />
                                </div>
                                <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg ${card.positive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                    {card.positive && <TrendingUp className="w-3 h-3" />}
                                    {card.trend}
                                </div>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-500">{card.title}</p>
                                <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-1">
                                    {card.value}
                                </h3>
                                <p className="text-xs text-slate-400 mt-1">{card.subtitle}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Bookings & Revenue Chart */}
                <Card className="border-none shadow-xl shadow-slate-200/50 dark:shadow-none bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl p-6">
                    <CardHeader className="p-0 mb-6">
                        <CardTitle className="text-lg font-bold flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-primary" />
                            Booking Analytics (Last 7 Days)
                        </CardTitle>
                    </CardHeader>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={analytics}>
                                <defs>
                                    <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                                <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fill: '#10b981', fontSize: 12 }} />
                                <Tooltip contentStyle={{ backgroundColor: '#fff', border: 'none', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                                <Legend />
                                <Area yAxisId="left" type="monotone" dataKey="bookings" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorBookings)" name="Bookings" />
                                <Area yAxisId="right" type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" name="Revenue ($)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* User Growth Chart */}
                <Card className="border-none shadow-xl shadow-slate-200/50 dark:shadow-none bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl p-6">
                    <CardHeader className="p-0 mb-6">
                        <CardTitle className="text-lg font-bold flex items-center gap-2">
                            <Users className="w-5 h-5 text-blue-500" />
                            User Growth (6 Months)
                        </CardTitle>
                    </CardHeader>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={userGrowth}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ backgroundColor: '#fff', border: 'none', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                                <Bar dataKey="users" fill="#3b82f6" radius={[4, 4, 0, 0]} name="New Users" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Car Types Distribution */}
                <Card className="border-none shadow-xl shadow-slate-200/50 dark:shadow-none bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl p-6">
                    <CardHeader className="p-0 mb-6">
                        <CardTitle className="text-lg font-bold flex items-center gap-2">
                            <Car className="w-5 h-5 text-purple-500" />
                            Revenue by Type
                        </CardTitle>
                    </CardHeader>
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={carTypeStats}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="revenue"
                                >
                                    {carTypeStats.map((entry: any, index: number) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} contentStyle={{ backgroundColor: '#fff', border: 'none', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Booking Status Distribution */}
                <Card className="border-none shadow-xl shadow-slate-200/50 dark:shadow-none bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl p-6">
                    <CardHeader className="p-0 mb-6">
                        <CardTitle className="text-lg font-bold flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                            Booking Status
                        </CardTitle>
                    </CardHeader>
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={statusStats}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {statusStats.map((entry: any, index: number) => (
                                        <Cell key={`cell-${index}`} fill={index === 0 ? '#10b981' : index === 1 ? '#f59e0b' : '#ef4444'} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: '#fff', border: 'none', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Recent Activities List */}
                <Card className="border-none shadow-xl shadow-slate-200/50 dark:shadow-none bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl p-6">
                    <CardHeader className="p-0 mb-6">
                        <CardTitle className="text-lg font-bold flex items-center justify-between">
                            <span>Recent Activities</span>
                            <span className="text-xs font-normal text-slate-400">Live Updates</span>
                        </CardTitle>
                    </CardHeader>
                    <div className="space-y-6 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                        {activities.length > 0 ? (
                            activities.map((activity, i) => (
                                <div key={i} className="flex gap-4">
                                    <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${activity.color}`} />
                                    <div className="flex-1">
                                        <p className="text-sm text-slate-900 dark:text-white">
                                            <span className="font-bold">{activity.user}</span> {activity.action}{' '}
                                            <span className="font-medium text-slate-500">{activity.item}</span>
                                        </p>
                                        <p className="text-xs text-slate-400 mt-1">{activity.timeAgo}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-slate-400 text-center py-8">No recent activities</p>
                        )}
                    </div>
                </Card>
            </div>

            {/* Top Vehicles */}
            {topVehicles.length > 0 && (
                <Card className="border-none shadow-xl shadow-slate-200/50 dark:shadow-none bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl p-6">
                    <CardHeader className="p-0 mb-6">
                        <CardTitle className="text-lg font-bold flex items-center gap-2">
                            <Truck className="w-5 h-5 text-primary" />
                            Top Performing Vehicles
                        </CardTitle>
                    </CardHeader>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        {topVehicles.map((vehicle, idx) => (
                            <div
                                key={idx}
                                className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-primary transition-colors"
                            >
                                <h4 className="font-bold text-slate-900 dark:text-white mb-1">
                                    {vehicle._id || 'Unknown'}
                                </h4>
                                <div className="space-y-1">
                                    <p className="text-sm text-slate-600 dark:text-slate-400">
                                        {vehicle.bookings} bookings
                                    </p>
                                    <p className="text-sm font-semibold text-green-600">
                                        ${vehicle.revenue?.toLocaleString() || 0}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            )}

            {/* Today's At-a-Glance */}
            <Card className="border-none shadow-xl shadow-slate-200/50 dark:shadow-none bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-6 border-l-4 border-primary">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                            Today's Summary
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            Quick overview of today's activities
                        </p>
                    </div>
                    <Clock className="w-12 h-12 text-primary opacity-20" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-xl bg-blue-500 text-white">
                            <Calendar className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                {stats.todayBookings}
                            </p>
                            <p className="text-sm text-slate-500">New Bookings</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-xl bg-indigo-500 text-white">
                            <Users className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                {stats.todayUsers}
                            </p>
                            <p className="text-sm text-slate-500">New Users</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-xl bg-green-500 text-white">
                            <MessageSquare className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                {stats.todayMessages}
                            </p>
                            <p className="text-sm text-slate-500">New Messages</p>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default AdminDashboard;
