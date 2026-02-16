import React, { useEffect, useState } from 'react';
import api from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Newspaper, Plus, Trash, Edit, Search, Calendar, User, Tag } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from '@/components/ui/textarea';

const AdminNews = () => {
    const { toast } = useToast();
    const [news, setNews] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [editingNews, setEditingNews] = useState<any>(null);

    const [formData, setFormData] = useState({
        title: '',
        content: '',
        image: '',
        category: 'Update',
        author: 'Admin'
    });

    useEffect(() => {
        fetchNews();
    }, []);

    const fetchNews = async () => {
        try {
            const res = await api.get('/news');
            setNews(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSave = async () => {
        try {
            setLoading(true);
            if (editingNews) {
                await api.put(`/news/${editingNews.id}`, formData);
                toast({ title: "News Updated", description: "Article has been modified successfully." });
            } else {
                await api.post('/news', formData);
                toast({ title: "News Published", description: "New article is now live." });
            }
            fetchNews();
            setIsOpen(false);
            setEditingNews(null);
            setFormData({ title: '', content: '', image: '', category: 'Update', author: 'Admin' });
        } catch (error) {
            toast({ title: "Operation Failed", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure?")) return;
        try {
            await api.delete(`/news/${id}`);
            toast({ title: "News Deleted" });
            fetchNews();
        } catch (error) {
            toast({ title: "Delete Failed", variant: "destructive" });
        }
    };

    const openEdit = (item: any) => {
        setEditingNews(item);
        setFormData({
            title: item.title,
            content: item.content,
            image: item.image || '',
            category: item.category || 'Update',
            author: item.author || 'Admin'
        });
        setIsOpen(true);
    };

    const filteredNews = news.filter(n =>
        n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">News & Editorial</h1>
                    <p className="text-slate-500">Manage blog posts, company updates, and news articles.</p>
                </div>
                <Dialog open={isOpen} onOpenChange={(v) => { setIsOpen(v); if (!v) setEditingNews(null); }}>
                    <DialogTrigger asChild>
                        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 h-12 px-6 rounded-xl shadow-lg shadow-primary/20 transition-all font-bold">
                            <Plus className="w-5 h-5" /> Write New Article
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px] rounded-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>{editingNews ? 'Edit Article' : 'Compose News'}</DialogTitle>
                            <DialogDescription>
                                Fill in the details for your article. It will be visible to all visitors.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="space-y-2">
                                <Label>Title</Label>
                                <Input value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="Breaking: New Fleet Arrival" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Category</Label>
                                    <Input value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} placeholder="Update, Event, Promo..." />
                                </div>
                                <div className="space-y-2">
                                    <Label>Author</Label>
                                    <Input value={formData.author} onChange={e => setFormData({ ...formData, author: e.target.value })} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Image URL</Label>
                                <Input value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} placeholder="https://..." />
                            </div>
                            <div className="space-y-2">
                                <Label>Content</Label>
                                <Textarea value={formData.content} onChange={e => setFormData({ ...formData, content: e.target.value })} className="h-40" placeholder="Write your article here..." />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button onClick={handleSave} disabled={loading} className="w-full h-12 rounded-xl font-bold">
                                {loading ? 'Saving...' : 'Publish Update'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <Card className="border-none shadow-xl shadow-slate-200/50 dark:shadow-none bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl overflow-hidden">
                <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-6">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                            placeholder="Search by title or category..."
                            className="pl-10 h-11 bg-slate-50 dark:bg-slate-800 border-none rounded-xl"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-slate-50/50 dark:bg-slate-800/50">
                            <TableRow className="hover:bg-transparent border-slate-100 dark:border-slate-800">
                                <TableHead className="py-4 pl-6 font-bold text-slate-900 dark:text-white">Article</TableHead>
                                <TableHead className="font-bold text-slate-900 dark:text-white">Category</TableHead>
                                <TableHead className="font-bold text-slate-900 dark:text-white">Date</TableHead>
                                <TableHead className="text-right pr-6 font-bold text-slate-900 dark:text-white">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredNews.map((item) => (
                                <TableRow key={item.id} className="group border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                    <TableCell className="py-4 pl-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700">
                                                <img src={item.image || 'https://images.unsplash.com/photo-1542281286-9e0a16bb7366?w=200'} alt={item.title} className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900 dark:text-white">{item.title}</p>
                                                <p className="text-xs text-slate-500 line-clamp-1 max-w-xs">{item.content}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className="bg-blue-50 text-blue-600 border-none rounded-lg px-2 py-0.5">
                                            {item.category}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-xs text-slate-500 font-medium">
                                            {new Date(item.createdAt).toLocaleDateString()}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right pr-6">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg" onClick={() => openEdit(item)}>
                                                <Edit className="w-4 h-4 text-slate-500" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg hover:bg-red-50 hover:text-red-700" onClick={() => handleDelete(item.id)}>
                                                <Trash className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {filteredNews.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-32 text-center text-slate-400">
                                        No articles found.
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

export default AdminNews;
