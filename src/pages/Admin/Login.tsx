import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from "sonner";
import { useAuth } from '@/contexts/AuthContext';
import PremiumEffects from '@/components/shared/PremiumEffects';
import AnimatedBackground from '@/components/shared/AnimatedBackground';
import { Mail, Lock, Car, LogIn } from 'lucide-react';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login, user } = useAuth();

    useEffect(() => {
        if (user && user.role === 'admin') {
            navigate('/admin/dashboard');
        }
    }, [user, navigate]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await api.post('/auth/login', { email, password });
            const { token, user } = response.data;

            if (user.role !== 'admin') {
                toast.error("Unauthorized access. Admin privileges required.");
                setLoading(false);
                return;
            }

            login(token, user);
            toast.success("Welcome back, Admin!");
            navigate('/admin/dashboard');
        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.message || "Invalid credentials");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex relative overflow-hidden items-center justify-center bg-background">
            <PremiumEffects />
            <AnimatedBackground />

            <div className="relative z-10 w-full max-w-md p-8">
                <div className="bg-secondary/30 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl">
                    {/* Logo */}
                    <div className="flex flex-col items-center gap-4 mb-8">
                        <div className="w-16 h-16 rounded-2xl accent-gradient flex items-center justify-center shadow-lg">
                            <Car className="w-10 h-10 text-accent-foreground" />
                        </div>
                        <h2 className="text-3xl font-display font-bold text-foreground">
                            Admin<span className="text-gradient">Portal</span>
                        </h2>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground ml-1">Admin Email</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <Input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@citycars.az"
                                    className="h-12 pl-12 bg-background/50 border-border rounded-xl focus:ring-2 focus:ring-accent"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground ml-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <Input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="h-12 pl-12 bg-background/50 border-border rounded-xl focus:ring-2 focus:ring-accent"
                                    required
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full h-12 text-lg accent-gradient text-accent-foreground hover:opacity-90 transition-all rounded-xl shadow-lg flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <LogIn className="w-5 h-5" />
                                    <span>Access Dashboard</span>
                                </>
                            )}
                        </Button>
                    </form>
                </div>

                <p className="mt-8 text-center text-muted-foreground text-sm">
                    Protected by CityCars Security System
                </p>
            </div>
        </div>
    );
};

export default AdminLogin;
