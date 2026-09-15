import { useState, useEffect } from 'react';
import { getNews, createNews, updateNews, deleteNews } from '../../services/newsService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Modal from '../../components/common/Modal';
import toast, { Toaster } from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { Newspaper, Plus, Edit, Trash2, Globe, EyeOff, Loader } from 'lucide-react';

const NewsForm = ({ article, onClose }) => {
  const isEditing = !!article;
  const [loading, setLoading] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: article || { published: true, category: 'Announcement' }
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      if (isEditing) {
        await updateNews(article._id, data);
        toast.success('News updated');
      } else {
        await createNews(data);
        toast.success('News published');
      }
      onClose(true);
    } catch (error) {
      toast.error('Failed to save news');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={true} onClose={() => onClose(false)} title={isEditing ? 'Edit News' : 'Add News'} maxWidth="max-w-2xl">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-secondary mb-1">Title*</label>
          <input type="text" className={`input-field ${errors.title ? 'border-red-500' : ''}`} {...register('title', { required: true })} />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-secondary mb-1">Category</label>
            <select className="input-field" {...register('category')}>
              <option value="Trading News">Trading News</option>
              <option value="Course Update">Course Update</option>
              <option value="Platform News">Platform News</option>
              <option value="Market Analysis">Market Analysis</option>
              <option value="Announcement">Announcement</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-secondary mb-1">Status</label>
            <select className="input-field" {...register('published')}>
              <option value="true">Published</option>
              <option value="false">Draft</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-secondary mb-1">Image URL</label>
          <input type="url" placeholder="https://..." className="input-field" {...register('image')} />
        </div>

        <div>
          <label className="block text-xs font-medium text-secondary mb-1">Content*</label>
          <textarea rows="6" className={`input-field resize-none ${errors.content ? 'border-red-500' : ''}`} {...register('content', { required: true })}></textarea>
        </div>

        <div className="pt-4 flex justify-end gap-3 mt-6">
          <button type="button" onClick={() => onClose(false)} className="btn-secondary">Cancel</button>
          <button type="submit" disabled={loading} className="btn-primary min-w-[120px]">
            {loading ? <Loader className="animate-spin mx-auto" size={18} /> : 'Save'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

const NewsManagement = () => {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingArticle, setEditingArticle] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const fetchNews = async () => {
    try {
      const { data } = await getNews({ limit: 100 });
      setNewsList(data.news);
    } catch (error) {
      toast.error('Failed to load news');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this article?')) return;
    try {
      await deleteNews(id);
      toast.success('Article deleted');
      fetchNews();
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const toggleStatus = async (article) => {
    try {
      await updateNews(article._id, { published: !article.published });
      toast.success(article.published ? 'Unpublished' : 'Published');
      fetchNews();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />
      {isFormOpen && <NewsForm article={editingArticle} onClose={(refresh) => { setIsFormOpen(false); setEditingArticle(null); if (refresh) fetchNews(); }} />}

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-primary">News & Updates</h1>
          <p className="text-secondary text-sm">Manage platform announcements.</p>
        </div>
        <button onClick={() => { setEditingArticle(null); setIsFormOpen(true); }} className="btn-primary">
          <Plus size={18} /> Create News
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? <LoadingSpinner fullScreen={false} /> : newsList.map(article => (
          <div key={article._id} className="card overflow-hidden flex flex-col group relative">
            
            <div className="absolute top-2 right-2 flex gap-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => { setEditingArticle(article); setIsFormOpen(true); }} className="p-2 bg-white/90 dark:bg-black/80 rounded hover:bg-blue-500 hover:text-white transition-colors shadow"><Edit size={16}/></button>
              <button onClick={() => handleDelete(article._id)} className="p-2 bg-white/90 dark:bg-black/80 rounded hover:bg-red-500 hover:text-white text-red-500 transition-colors shadow"><Trash2 size={16}/></button>
            </div>

            <div className="h-40 overflow-hidden relative">
              <img src={article.image || `https://source.unsplash.com/random/400x200?sig=${article._id}`} alt="" className="w-full h-full object-cover" onError={e => e.target.src='https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=400'}/>
              <div className="absolute top-2 left-2 px-2 py-1 bg-black/60 backdrop-blur text-white text-xs rounded shadow font-semibold">
                {article.category}
              </div>
            </div>
            
            <div className="p-5 flex-1 flex flex-col">
              <h3 className="font-bold text-primary line-clamp-2 mb-2">{article.title}</h3>
              <p className="text-sm text-secondary line-clamp-3 mb-4 flex-1">{article.excerpt || article.content.substring(0, 100)}</p>
              
              <div className="flex items-center justify-between pt-4 border-t border-theme mt-auto">
                <span className="text-xs text-muted">{new Date(article.createdAt).toLocaleDateString()}</span>
                <button 
                  onClick={() => toggleStatus(article)} 
                  className={`flex items-center gap-1 text-xs px-2 py-1 rounded font-semibold transition-colors ${article.published ? 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20' : 'bg-amber-500/10 text-amber-500 hover:bg-amber-500/20'}`}
                >
                  {article.published ? <Globe size={14} /> : <EyeOff size={14} />}
                  {article.published ? 'Published' : 'Draft'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsManagement;
