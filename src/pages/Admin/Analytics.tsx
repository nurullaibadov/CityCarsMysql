import React, { useEffect, useState } from 'react';
import api from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    DollarSign,
    TrendingUp,
    Calendar,
    Download,
    RefreshCw,
    BarChart3,
    PieChart as PieChartIcon
} from 'lucide-react';
import {
    AreaChart,
    Area,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts';
import { Button } from '@/components/ui/button';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const Analytics = () => {
    const [revenue, setRevenue] = useState({ total: 0, byStatus: [], monthly: [] });
    const [analytics, setAnalytics] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchAnalyticsData = async () => {
        setLoading(true);
        try {
            const [revenueRes, analyticsRes] = await Promise.all([
                api.get('/admin/revenue'),
                api.get('/admin/analytics')
            ]);

            setRevenue(revenueRes.data);
            setAnalytics(analyticsRes.data);
        } catch (error) {
            console.error("Failed to fetch analytics", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnalyticsData();
    }, []);

    const exportReport = () => {
        // TODO: Implement CSV/PDF export
        alert('Export functionality coming soon!');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-3">
                    <RefreshCw className="w-8 h-8 animate-spin text-primary" />
                    <p className="text-muted-foreground">Loading analytics...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-10">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                        Analytics & Reports
                    </h1>
                    <p className="text-slate-500 mt-1">
                        Comprehensive business intelligence and performance metrics
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        onClick={fetchAnalyticsData}
                        variant="outline"
                        className="flex items-center gap-2"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Refresh
                    </Button>
                    <Button
                        onClick={exportReport}
                        className="flex items-center gap-2 bg-primary"
                    >
                        <Download className="w-4 h-4" />
                        Export Report
                    </Button>
                </div>
            </div>

            {/* Revenue Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-1 border-none shadow-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm">
                                <DollarSign className="w-6 h-6" />
                            </div>
                            <TrendingUp className="w-5 h-5 opacity-50" />
                        </div>
                        <div>
                            <p className="text-sm font-medium opacity-90">Total Revenue</p>
                            <h3 className="text-4xl font-bold mt-2">
                                ${revenue.total.toLocaleString()}
                            </h3>
                            <p className="text-xs opacity-75 mt-2">All-time earnings</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="md:col-span-2 border-none shadow-xl">
                    <CardHeader>
                        <CardTitle className="text-lg">Revenue by Booking Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[200px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={revenue.byStatus}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ _id, revenue }) => `${_id}: $${revenue.toLocaleString()}`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="revenue"
                                    >
                                        {revenue.byStatus.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Monthly Revenue Trend */}
            <Card className="border-none shadow-xl">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-primary" />
                        Monthly Revenue Trend (Last 6 Months)
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={revenue.monthly}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis
                                    dataKey="_id"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#64748b', fontSize: 12 }}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#64748b', fontSize: 12 }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#fff',
                                        border: 'none',
                                        borderRadius: '12px',
                                        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                                    }}
                                />
                                <Legend />
                                <Bar
                                    dataKey="revenue"
                                    fill="hsl(var(--primary))"
                                    radius={[8, 8, 0, 0]}
                                    name="Revenue ($)"
                                />
                                <Bar
                                    dataKey="count"
                                    fill="#10b981"
                                    radius={[8, 8, 0, 0]}
                                    name="Bookings"
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* Weekly Performance */}
            <Card className="border-none shadow-xl">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-primary" />
                        Weekly Performance (Last 7 Days)
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={analytics}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#64748b', fontSize: 12 }}
                                />
                                <YAxis
                                    yAxisId="left"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#64748b', fontSize: 12 }}
                                />
                                <YAxis
                                    yAxisId="right"
                                    orientation="right"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#10b981', fontSize: 12 }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#fff',
                                        border: 'none',
                                        borderRadius: '12px',
                                        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                                    }}
                                />
                                <Legend />
                                <Line
                                    yAxisId="left"
                                    type="monotone"
                                    dataKey="bookings"
                                    stroke="hsl(var(--primary))"
                                    strokeWidth={3}
                                    dot={{ fill: 'hsl(var(--primary))', r: 5 }}
                                    name="Bookings"
                                />
                                <Line
                                    yAxisId="right"
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#10b981"
                                    strokeWidth={3}
                                    dot={{ fill: '#10b981', r: 5 }}
                                    name="Revenue ($)"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* Status Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {revenue.byStatus.map((status, idx) => (
                    <Card
                        key={idx}
                        className="border-none shadow-xl hover:scale-105 transition-transform"
                    >
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-2">
                                <div
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                                />
                                <span className="text-xs uppercase font-bold text-slate-400">
                                    {status._id}
                                </span>
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                                    {status.count}
                                </h3>
                                <p className="text-sm text-slate-500 mt-1">
                                    ${status.revenue.toLocaleString()}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default Analytics;
