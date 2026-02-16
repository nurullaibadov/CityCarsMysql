import React, { useState, useEffect } from 'react';
import api from '@/services/api';
import { ShieldAlert, Users, UserCheck, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const AdminBlacklist = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [drivers, setDrivers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    const fetchData = async () => {
        setLoading(true);
        try {
            const [usersRes, driversRes] = await Promise.all([
                api.get('/users'),
                api.get('/drivers')
            ]);

            // Filter only blacklisted
            const blacklistedUsers = (usersRes.data || []).filter((u: any) => u.isBlacklisted);
            const blacklistedDrivers = (driversRes.data || []).filter((d: any) => d.isBlacklisted);

            setUsers(blacklistedUsers);
            setDrivers(blacklistedDrivers);
        } catch (error) {
            console.error("Fetch Error:", error);
            toast({
                title: "Error loading blacklist",
                description: "Failed to connect to the server.",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const toggleUserBlacklist = async (userId: string) => {
        if (!userId) {
            toast({ title: "Invalid User ID", variant: "destructive" });
            return;
        }
        try {
            await api.put(`/users/${userId}/blacklist`);
            toast({ title: "User status updated successfully" });
            fetchData();
        } catch (error) {
            toast({ title: "Action failed", description: "Could not update user status.", variant: "destructive" });
        }
    };

    const toggleDriverBlacklist = async (driverId: string) => {
        if (!driverId) {
            toast({ title: "Invalid Driver ID", variant: "destructive" });
            return;
        }
        try {
            await api.put(`/drivers/${driverId}/blacklist`);
            toast({ title: "Driver status updated successfully" });
            fetchData();
        } catch (error) {
            toast({ title: "Action failed", description: "Could not update driver status.", variant: "destructive" });
        }
    };

    const EmptyState = ({ title }: { title: string }) => (
        <div className="flex flex-col items-center justify-center py-12 text-slate-400">
            <ShieldAlert className="w-12 h-12 mb-4 opacity-20" />
            <p className="font-semibold">{title}</p>
        </div>
    );

    return (
        <div className="space-y-8 pb-10">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
                    <ShieldAlert className="w-8 h-8 text-red-500" />
                    Security & Blacklist
                </h1>
                <p className="text-slate-500 max-w-2xl">
                    Manage restricted accounts and drivers. Blacklisted entities are barred from using the platform's core services.
                </p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* Users Blacklist */}
                <Card className="border-none shadow-xl overflow-hidden bg-white dark:bg-slate-900">
                    <CardHeader className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 p-6">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Users className="w-5 h-5 text-indigo-500" />
                                Restricted Users
                            </CardTitle>
                            <span className="px-3 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-bold uppercase tracking-wider">
                                {users.length} Total
                            </span>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        {loading ? (
                            <div className="p-8 text-center"><RefreshCw className="w-6 h-6 animate-spin mx-auto text-primary" /></div>
                        ) : users.length === 0 ? (
                            <EmptyState title="No restricted users found" />
                        ) : (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="hover:bg-transparent border-slate-100 dark:border-slate-800">
                                            <TableHead className="w-[250px] font-bold uppercase text-[10px] tracking-widest px-6">User</TableHead>
                                            <TableHead className="font-bold uppercase text-[10px] tracking-widest">Email Identity</TableHead>
                                            <TableHead className="text-right font-bold uppercase text-[10px] tracking-widest px-6">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {users.map((user) => (
                                            <TableRow key={user.id || user._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 border-slate-50 dark:border-slate-800 transition-colors">
                                                <TableCell className="px-6">
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="h-8 w-8 ring-2 ring-red-500/10">
                                                            <AvatarImage src={`https://ui-avatars.com/api/?name=${user.name || user.email}&background=random`} />
                                                            <AvatarFallback>{(user.name || user.email).charAt(0)}</AvatarFallback>
                                                        </Avatar>
                                                        <span className="font-bold text-slate-900 dark:text-white capitalize">{user.name || 'Anonymous User'}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-slate-500 font-medium">{user.email}</TableCell>
                                                <TableCell className="text-right px-6">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="rounded-xl border-green-200 text-green-600 hover:bg-green-50 dark:border-green-900/30 dark:hover:bg-green-900/10 font-bold"
                                                        onClick={() => toggleUserBlacklist(user.id || user._id)}
                                                    >
                                                        Unblock Account
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Drivers Blacklist */}
                <Card className="border-none shadow-xl overflow-hidden bg-white dark:bg-slate-900">
                    <CardHeader className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 p-6">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <UserCheck className="w-5 h-5 text-emerald-500" />
                                Suspended Drivers
                            </CardTitle>
                            <span className="px-3 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-bold uppercase tracking-wider">
                                {drivers.length} Total
                            </span>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        {loading ? (
                            <div className="p-8 text-center"><RefreshCw className="w-6 h-6 animate-spin mx-auto text-primary" /></div>
                        ) : drivers.length === 0 ? (
                            <EmptyState title="No suspended drivers found" />
                        ) : (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="hover:bg-transparent border-slate-100 dark:border-slate-800">
                                            <TableHead className="w-[250px] font-bold uppercase text-[10px] tracking-widest px-6">Driver</TableHead>
                                            <TableHead className="font-bold uppercase text-[10px] tracking-widest">Experience</TableHead>
                                            <TableHead className="text-right font-bold uppercase text-[10px] tracking-widest px-6">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {drivers.map((driver) => (
                                            <TableRow key={driver.id || driver._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 border-slate-50 dark:border-slate-800 transition-colors">
                                                <TableCell className="px-6">
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="h-8 w-8 ring-2 ring-red-500/10 text-xs">
                                                            <AvatarImage src={driver.image} />
                                                            <AvatarFallback>{driver.name?.charAt(0)}</AvatarFallback>
                                                        </Avatar>
                                                        <span className="font-bold text-slate-900 dark:text-white">{driver.name}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <span className="text-slate-500 font-medium">{driver.experience} Years Elite Status</span>
                                                </TableCell>
                                                <TableCell className="text-right px-6">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="rounded-xl border-green-200 text-green-600 hover:bg-green-50 dark:border-green-900/30 dark:hover:bg-green-900/10 font-bold"
                                                        onClick={() => toggleDriverBlacklist(driver.id || driver._id)}
                                                    >
                                                        Restore Status
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AdminBlacklist;
