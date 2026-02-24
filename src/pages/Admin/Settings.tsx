import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Shield, Bell, AppWindow, Database, Save, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import api from '@/services/api';

const Settings: React.FC = () => {
    const { user, login } = useAuth();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: ''
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '', // assuming user has phone in type
                address: user.address || '' // assuming user has address in type
            });
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.put('/auth/profile', formData);
            const updatedUser = { ...user, ...res.data.user };
            const token = localStorage.getItem('token');
            if (token) {
                login(token, updatedUser);
            }
            toast({
                title: "Profile Updated",
                description: "Your administrator profile has been updated successfully.",
            });
        } catch (error: any) {
            console.error(error);
            toast({
                title: "Update Failed",
                description: "Could not update profile.",
                variant: 'destructive'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header>
                <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white">Admin Settings</h1>
                <p className="text-slate-500 dark:text-slate-400">Configure application preferences and manage your profile.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Profile Settings */}
                <Card className="rounded-[2rem] border-slate-200/60 dark:border-slate-800/60 shadow-xl shadow-slate-200/20">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Shield className="w-5 h-5 text-accent" />
                            Admin Profile
                        </CardTitle>
                        <CardDescription>Update your personal information and credentials.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleUpdateProfile} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input id="name" name="name" value={formData.name} onChange={handleChange} className="bg-slate-50 dark:bg-slate-900" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input id="email" name="email" value={formData.email} onChange={handleChange} className="bg-slate-50 dark:bg-slate-900" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone</Label>
                                    <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="+994..." className="bg-slate-50 dark:bg-slate-900" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="address">Address</Label>
                                    <Input id="address" name="address" value={formData.address} onChange={handleChange} placeholder="Baku, Azerbaijan" className="bg-slate-50 dark:bg-slate-900" />
                                </div>
                            </div>
                            <Button type="submit" className="w-full accent-gradient text-accent-foreground" disabled={loading}>
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Update Profile
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Notifications */}
                <Card className="rounded-[2rem] border-slate-200/60 dark:border-slate-800/60 shadow-xl shadow-slate-200/20">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Bell className="w-5 h-5 text-accent" />
                            Communications
                        </CardTitle>
                        <CardDescription>Configure SMTP and notification triggers.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Email Notifications</Label>
                                <p className="text-xs text-muted-foreground">Send real-time alerts for new bookings.</p>
                            </div>
                            <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>SMTP Status</Label>
                                <p className="text-xs text-muted-foreground">Gateway: Gmail</p>
                            </div>
                            <Badge className="bg-green-100 text-green-700 border-none">Active</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Two-Factor Auth</Label>
                                <p className="text-xs text-muted-foreground">Require code for login.</p>
                            </div>
                            <Switch />
                        </div>
                    </CardContent>
                </Card>

                {/* System Settings */}
                <Card className="rounded-[2rem] border-slate-200/60 dark:border-slate-800/60 shadow-xl shadow-slate-200/20 md:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Database className="w-5 h-5 text-accent" />
                            System Intelligence
                        </CardTitle>
                        <CardDescription>Fine-tune application performance and data synchronization.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid md:grid-cols-3 gap-6">
                        <div className="p-6 rounded-2xl bg-secondary/50 border border-border/50">
                            <AppWindow className="w-8 h-8 text-accent mb-4" />
                            <h4 className="font-bold mb-1">Frontend Version</h4>
                            <p className="text-sm text-muted-foreground">v2.5.0 (Stable)</p>
                        </div>
                        <div className="p-6 rounded-2xl bg-secondary/50 border border-border/50">
                            <Database className="w-8 h-8 text-accent mb-4" />
                            <h4 className="font-bold mb-1">Database API</h4>
                            <p className="text-sm text-muted-foreground">Sequelize (PostgreSQL)</p>
                        </div>
                        <div className="p-6 rounded-2xl bg-secondary/50 border border-border/50">
                            <Shield className="w-8 h-8 text-accent mb-4" />
                            <h4 className="font-bold mb-1">Last Sync</h4>
                            <p className="text-sm text-muted-foreground">{new Date().toLocaleDateString()}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Settings;
