import React, { useEffect, useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Calendar, ArrowRight, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import api from '@/services/api';

const News: React.FC = () => {
  const { t } = useLanguage();
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await api.get('/news');
        setNews(res.data);
      } catch (error) {
        console.error("Failed to load news", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const featured = news.length > 0 ? news[0] : null;
  const others = news.length > 1 ? news.slice(1) : [];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="hero-section py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-primary-foreground mb-4">
            News & Updates
          </h1>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto">
            Stay updated with the latest news, tips, and announcements from CityCars
          </p>
        </div>
      </section>

      {/* Featured Article */}
      {featured && (
        <section className="py-12 bg-background">
          <div className="container mx-auto px-4">
            <Card className="overflow-hidden card-gradient border-border shadow-xl hover:shadow-2xl transition-all duration-500">
              <div className="grid lg:grid-cols-2">
                <div className="h-64 lg:h-auto overflow-hidden">
                  <img
                    src={featured.image || 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800&q=80'}
                    alt={featured.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <CardContent className="p-8 lg:p-12 flex flex-col justify-center">
                  <span className="inline-block px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4 w-fit">
                    {featured.category || 'Update'}
                  </span>
                  <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-4">
                    {featured.title}
                  </h2>
                  <p className="text-muted-foreground mb-6 line-clamp-3">
                    {featured.content}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formatDate(featured.createdAt)}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {featured.author || 'Admin'}
                    </span>
                  </div>
                  <Button className="w-fit accent-gradient text-accent-foreground hover:opacity-90">
                    Read More
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </div>
            </Card>
          </div>
        </section>
      )}

      {/* News Grid */}
      <section className="py-12 bg-secondary/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-display font-bold text-foreground mb-8">
            Latest Articles
          </h2>
          {news.length === 0 && !loading ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground">No news articles published yet.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {others.map((article, index) => (
                <Card
                  key={article.id}
                  className="overflow-hidden card-gradient border-border hover:shadow-2xl transition-all duration-500 animate-slide-up group"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="h-48 overflow-hidden">
                    <img
                      src={article.image || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80'}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                  <CardContent className="p-6">
                    <span className="inline-block px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium mb-3">
                      {article.category || 'General'}
                    </span>
                    <h3 className="text-lg font-display font-bold text-foreground mb-3 line-clamp-2 group-hover:text-accent transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                      {article.content}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(article.createdAt)}
                      </span>
                      <Link to="#" className="text-accent hover:underline flex items-center gap-1">
                        Read More
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <Card className="hero-section border-0 overflow-hidden">
            <CardContent className="p-8 md:p-12 text-center">
              <h2 className="text-2xl md:text-3xl font-display font-bold text-primary-foreground mb-4">
                Subscribe to Our Newsletter
              </h2>
              <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
                Get the latest news, travel tips, and exclusive offers delivered to your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 h-12 px-4 rounded-lg bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none focus:border-accent"
                />
                <Button className="h-12 px-6 bg-accent text-accent-foreground hover:bg-accent/90">
                  Subscribe
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </Layout>
  );
};

export default News;
