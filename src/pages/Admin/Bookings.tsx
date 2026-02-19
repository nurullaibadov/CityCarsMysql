import React, { useState, useEffect } from 'react';
import api from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, User, CheckCircle, XCircle, AlertCircle, Phone, Mail, Car, Search, Filter, CreditCard, DollarSign } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const AdminBookings = () => {
    const { toast } = useToast();
    const [bookings, setBookings] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const res = await api.get('/bookings');
            setBookings(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'confirmed':
                return <Badge className="bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400 border-none rounded-lg font-bold">Confirmed</Badge>;
            case 'completed':
                return <Badge className="bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 border-none rounded-lg font-bold">Completed</Badge>;
            case 'cancelled':
                return <Badge className="bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 border-none rounded-lg font-bold">Cancelled</Badge>;
            case 'pending':
            default:
                return <Badge className="bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400 border-none rounded-lg font-bold">Pending</Badge>;
        }
    };

    const getPaymentBadge = (paymentStatus: string, paymentMethod: string) => {
        if (paymentMethod === 'cash') {
            switch (paymentStatus?.toLowerCase()) {
                case 'paid':
                    return <Badge className="bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400 border-none rounded-lg font-bold gap-1"><DollarSign className="w-3 h-3" /> Cash Collected</Badge>;
                default:
                    return <Badge className="bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400 border-none rounded-lg font-bold gap-1"><DollarSign className="w-3 h-3" /> Cash on Pickup</Badge>;
            }
        }

        switch (paymentStatus?.toLowerCase()) {
            case 'paid':
                return <Badge className="bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400 border-none rounded-lg font-bold gap-1"><CreditCard className="w-3 h-3" /> Paid</Badge>;
            case 'failed':
                return <Badge className="bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 border-none rounded-lg font-bold gap-1"><XCircle className="w-3 h-3" /> Failed</Badge>;
            case 'refunded':
                return <Badge className="bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400 border-none rounded-lg font-bold gap-1"><CreditCard className="w-3 h-3" /> Refunded</Badge>;
            case 'pending':
            default:
                return <Badge className="bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400 border-none rounded-lg font-bold gap-1"><AlertCircle className="w-3 h-3" /> Pending</Badge>;
        }
    };

    const updateStatus = async (id: string, status: string) => {
        try {
            await api.put(`/bookings/${id}`, { status });
            toast({
                title: "Status Updated",
                description: `Booking #${String(id).padStart(6, '0')} is now ${status}.`,
            });
            fetchBookings();
        } catch (error) {
            toast({
                title: "Update Failed",
                description: "Could not update booking status.",
                variant: "destructive"
            });
        }
    };

    const updatePaymentStatus = async (id: string, paymentStatus: string) => {
        try {
            await api.put(`/bookings/${id}`, { paymentStatus });
            toast({
                title: "Payment Status Updated",
                description: `Payment for Booking #${String(id).padStart(6, '0')} marked as ${paymentStatus}.`,
            });
            fetchBookings();
        } catch (error) {
            toast({
                title: "Update Failed",
                description: "Could not update payment status.",
                variant: "destructive"
            });
        }
    };

    const filteredBookings = bookings.filter(b => {
        const matchesSearch =
            b.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            b.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            b.email?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'all' || b.status?.toLowerCase() === statusFilter;

        return matchesSearch && matchesStatus;
    });

    // Stats
    const pendingCount = bookings.filter(b => b.status?.toLowerCase() === 'pending').length;
    const confirmedCount = bookings.filter(b => b.status?.toLowerCase() === 'confirmed').length;
    const pendingPayments = bookings.filter(b => b.paymentStatus?.toLowerCase() === 'pending' || !b.paymentStatus).length;
    const paidPayments = bookings.filter(b => b.paymentStatus?.toLowerCase() === 'paid').length;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Reservations</h1>
                    <p className="text-slate-500">Monitor and manage all customer bookings and rental schedules.</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="border-none shadow-lg bg-amber-50/50 dark:bg-amber-900/10 rounded-2xl">
                    <CardContent className="p-5">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                                <AlertCircle className="w-5 h-5 text-amber-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-black text-amber-600">{pendingCount}</p>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-amber-500">Pending Bookings</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-lg bg-green-50/50 dark:bg-green-900/10 rounded-2xl">
                    <CardContent className="p-5">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                                <CheckCircle className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-black text-green-600">{confirmedCount}</p>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-green-500">Confirmed</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-lg bg-orange-50/50 dark:bg-orange-900/10 rounded-2xl">
                    <CardContent className="p-5">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                                <DollarSign className="w-5 h-5 text-orange-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-black text-orange-600">{pendingPayments}</p>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-orange-500">Payment Pending</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-lg bg-emerald-50/50 dark:bg-emerald-900/10 rounded-2xl">
                    <CardContent className="p-5">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                                <CreditCard className="w-5 h-5 text-emerald-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-black text-emerald-600">{paidPayments}</p>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-500">Payments Received</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-none shadow-xl shadow-slate-200/50 dark:shadow-none bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl overflow-hidden">
                <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-6">
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <Input
                                placeholder="Search by customer name or email..."
                                className="pl-10 h-11 bg-slate-50 dark:bg-slate-800 border-none rounded-xl"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2">
                            {['all', 'pending', 'confirmed', 'cancelled'].map((status) => (
                                <Button
                                    key={status}
                                    variant={statusFilter === status ? 'default' : 'outline'}
                                    size="sm"
                                    className={`rounded-xl capitalize text-xs font-bold ${statusFilter === status
                                        ? 'bg-slate-900 dark:bg-white dark:text-slate-900 text-white'
                                        : 'border-slate-200 dark:border-slate-700'
                                        }`}
                                    onClick={() => setStatusFilter(status)}
                                >
                                    {status === 'all' ? 'All' : status}
                                </Button>
                            ))}
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-slate-50/50 dark:bg-slate-800/50">
                            <TableRow className="hover:bg-transparent border-slate-100 dark:border-slate-800">
                                <TableHead className="py-4 pl-6 font-bold text-slate-900 dark:text-white">Customer</TableHead>
                                <TableHead className="font-bold text-slate-900 dark:text-white">Vehicle Context</TableHead>
                                <TableHead className="font-bold text-slate-900 dark:text-white">Duration</TableHead>
                                <TableHead className="font-bold text-slate-900 dark:text-white">Total Amount</TableHead>
                                <TableHead className="font-bold text-slate-900 dark:text-white">Booking Status</TableHead>
                                <TableHead className="font-bold text-slate-900 dark:text-white">Payment Status</TableHead>
                                <TableHead className="text-right pr-6 font-bold text-slate-900 dark:text-white">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredBookings.map((booking) => (
                                <TableRow key={booking.id} className="group border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                    <TableCell className="py-4 pl-6">
                                        <div className="space-y-1">
                                            <p className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                                <User className="w-3.5 h-3.5 text-slate-400" /> {booking.firstName} {booking.lastName}
                                            </p>
                                            <p className="text-xs text-slate-500 flex items-center gap-2">
                                                <Mail className="w-3 h-3" /> {booking.email}
                                            </p>
                                            <p className="text-xs text-slate-500 flex items-center gap-2">
                                                <Phone className="w-3 h-3" /> {booking.phone}
                                            </p>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2 font-medium text-slate-700 dark:text-slate-300">
                                            <Car className="w-4 h-4 text-primary" />
                                            <span>Vehicle: {booking.Car?.name || booking.vehicleName || 'Unknown'}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="space-y-1 text-xs">
                                            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                                <Calendar className="w-3 h-3" /> {booking.pickupDate}
                                                <Clock className="w-3 h-3 ml-2" /> {booking.pickupTime}
                                            </div>
                                            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider pl-5">to</div>
                                            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                                <Calendar className="w-3 h-3" /> {booking.returnDate}
                                                <Clock className="w-3 h-3 ml-2" /> {booking.returnTime}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-lg font-black text-slate-900 dark:text-white">${Number(booking.totalPrice)?.toFixed(2)}</span>
                                    </TableCell>
                                    <TableCell>{getStatusBadge(booking.status)}</TableCell>
                                    <TableCell>{getPaymentBadge(booking.paymentStatus, booking.paymentMethod)}</TableCell>
                                    <TableCell className="text-right pr-6">
                                        <div className="flex flex-col items-end gap-2">
                                            <div className="flex items-center gap-2">
                                                {booking.status?.toLowerCase() !== 'confirmed' && booking.status?.toLowerCase() !== 'cancelled' && (
                                                    <Button
                                                        size="sm"
                                                        className="bg-green-600 hover:bg-green-700 text-white rounded-lg h-8 px-3 text-[10px] font-bold uppercase"
                                                        onClick={() => updateStatus(booking.id, 'confirmed')}
                                                    >
                                                        <CheckCircle className="w-3.5 h-3.5 mr-1" /> Confirm
                                                    </Button>
                                                )}
                                                {booking.status?.toLowerCase() !== 'cancelled' && (
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg h-8 px-3 text-[10px] font-bold uppercase"
                                                        onClick={() => updateStatus(booking.id, 'cancelled')}
                                                    >
                                                        <XCircle className="w-3.5 h-3.5 mr-1" /> Cancel
                                                    </Button>
                                                )}
                                            </div>
                                            {/* Payment actions */}
                                            {booking.paymentStatus?.toLowerCase() !== 'paid' && booking.paymentMethod === 'cash' && (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="border-emerald-300 text-emerald-600 hover:bg-emerald-50 rounded-lg h-7 px-3 text-[10px] font-bold uppercase"
                                                    onClick={() => updatePaymentStatus(booking.id, 'paid')}
                                                >
                                                    <DollarSign className="w-3 h-3 mr-1" /> Mark Paid
                                                </Button>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {filteredBookings.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-64 text-center text-slate-400">
                                        No reservations found matching your criteria.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminBookings;
