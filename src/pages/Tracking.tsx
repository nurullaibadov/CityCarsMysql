import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Search, MapPin, Car, User, Clock, CheckCircle, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSearchParams } from 'react-router-dom';
import api from '@/services/api';
import { useToast } from '@/hooks/use-toast';

const Tracking: React.FC = () => {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [trackingId, setTrackingId] = useState(searchParams.get('id') || '');
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState<any>(null);

  React.useEffect(() => {
    if (searchParams.get('id')) {
      handleTrack(null, searchParams.get('id') || '');
    }
  }, []);

  const handleTrack = async (e: React.FormEvent | null, idOverride?: string) => {
    if (e) e.preventDefault();
    const id = idOverride || trackingId;
    if (!id) return;

    setLoading(true);
    try {
      const res = await api.get(`/bookings/${id}/tracking`);
      setBooking(res.data);
      setShowResult(true);
    } catch (error: any) {
      console.error(error);
      toast({
        title: 'Record Not Found',
        description: 'The provided tracking ID is invalid or has expired.',
        variant: 'destructive'
      });
      setShowResult(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="hero-section py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-primary-foreground mb-4">
            {t('trackYourRide')}
          </h1>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto">
            Monitor your booking in real-time
          </p>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <Card className="card-gradient border-border shadow-xl">
              <CardContent className="p-8">
                <form onSubmit={(e) => handleTrack(e)} className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      value={trackingId}
                      onChange={(e) => setTrackingId(e.target.value)}
                      placeholder="Enter booking ID (e.g., MongoDB ID)"
                      className="h-14 pl-12 bg-secondary/50 border-border text-lg"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="h-14 px-8 accent-gradient text-accent-foreground hover:opacity-90"
                  >
                    {loading ? 'Searching...' : t('track')}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Tracking Result */}
      {showResult && booking && (
        <section className="pb-16 bg-background animate-slide-up">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Card className="card-gradient border-border shadow-xl overflow-hidden">
                {/* Status Bar */}
                <div className="hero-section p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <p className="text-primary-foreground/60 text-sm">Booking ID</p>
                      <p className="text-2xl font-bold text-primary-foreground">{booking.id}</p>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-accent-foreground uppercase tracking-widest font-bold">
                      <Navigation className="w-5 h-5" />
                      <span>{booking.status}</span>
                    </div>
                  </div>
                </div>

                <CardContent className="p-8">
                  {/* Progress Bar */}
                  <div className="mb-8">
                    <div className="h-4 bg-secondary/30 rounded-full overflow-hidden border border-white/10">
                      <div
                        className="h-full accent-gradient transition-all duration-1000 relative"
                        style={{ width: `${booking.progress || 10}%` }}
                      >
                        <div className="absolute inset-0 bg-white/20 animate-pulse" />
                      </div>
                    </div>
                    <div className="flex justify-between mt-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      <span>{booking.pickupLocation}</span>
                      <span className="text-accent underline decoration-accent/30 decoration-2 underline-offset-4">Tracking Live</span>
                      <span>{booking.returnLocation}</span>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-12">
                    {/* Details */}
                    <div className="space-y-6">
                      <h3 className="font-display font-bold text-foreground text-2xl mb-6">Asset Profile</h3>
                      <div className="group p-5 rounded-2xl bg-secondary/30 border border-white/5 hover:border-accent/20 transition-all">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl accent-gradient flex items-center justify-center shadow-lg shadow-accent/20">
                            <Car className="w-6 h-6 text-accent-foreground" />
                          </div>
                          <div>
                            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Selected Vehicle</p>
                            <p className="font-bold text-lg text-foreground">{booking.vehicleName || 'Premium Fleet'}</p>
                          </div>
                        </div>
                      </div>
                      <div className="group p-5 rounded-2xl bg-secondary/30 border border-white/5 hover:border-accent/20 transition-all">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center shadow-lg">
                            <User className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Assigned Specialist</p>
                            <p className="font-bold text-lg text-foreground">{booking.driverName || 'Allocating Specialist...'}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Timeline */}
                    <div>
                      <h3 className="font-display font-bold text-foreground text-2xl mb-6">Execution Log</h3>
                      <div className="space-y-8 relative">
                        <div className="absolute left-4 top-2 bottom-2 w-px bg-border/40" />
                        {[
                          { label: 'System Check', time: 'Initiated', done: true },
                          { label: 'Booking Secured', time: 'Confirmed', done: true },
                          { label: 'Asset Preparation', time: 'Active', done: booking.status !== 'pending' },
                          { label: 'Journey Start', time: 'Pending', done: ['in_transit', 'completed'].includes(booking.status) },
                        ].map((item, index) => (
                          <div key={index} className="flex items-start gap-6 relative z-10">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 transition-all ${item.done ? 'bg-accent border-accent text-accent-foreground scale-110 shadow-lg' : 'bg-background border-border text-muted-foreground'
                              }`}>
                              {item.done ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                            </div>
                            <div>
                              <p className={`font-bold tracking-tight ${item.done ? 'text-foreground' : 'text-muted-foreground'}`}>
                                {item.label}
                              </p>
                              <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground opacity-60">{item.time}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
};

export default Tracking;
