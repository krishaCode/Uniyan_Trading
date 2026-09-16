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
    <div className="admin-news-page">
      <Toaster position="top-right" />
      {isFormOpen && <NewsForm article={editingArticle} onClose={(refresh) => { setIsFormOpen(false); setEditingArticle(null); if (refresh) fetchNews(); }} />}

      <div className="admin-news-heading">
        <div>
          <p className="dashboard-kicker">EDITORIAL DESK</p>
          <h1>News &amp; Updates</h1>
          <p>Publish announcements, course updates, and market information for your learners.</p>
        </div>
        <div className="admin-news-heading-actions">
          <div className="admin-news-summary"><strong>{newsList.length}</strong><span>total articles</span></div>
          <button onClick={() => { setEditingArticle(null); setIsFormOpen(true); }} className="btn-primary">
            <Plus size={18} /> Create news
          </button>
        </div>
      </div>

      <div className="admin-news-grid">
        {loading ? <LoadingSpinner fullScreen={false} /> : newsList.map(article => (
          <article key={article._id} className="admin-news-card">
            
            <div className="admin-news-media">
              <img src={article.image || `https://source.unsplash.com/random/400x200?sig=${article._id}`} alt="" onError={e => e.target.src='https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=400'}/>
              <span>{article.category}</span>
              <div className="admin-news-card-actions">
                <button onClick={() => { setEditingArticle(article); setIsFormOpen(true); }} className="admin-news-action admin-news-edit" title="Edit article"><Edit size={15}/></button>
                <button onClick={() => handleDelete(article._id)} className="admin-news-action admin-news-delete" title="Delete article"><Trash2 size={15}/></button>
              </div>
            </div>
            <div className="admin-news-card-body">
              <h2>{article.title}</h2>
              <p>{article.excerpt || article.content.substring(0, 100)}</p>
              
              <div className="admin-news-card-footer">
                <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                <button 
                  onClick={() => toggleStatus(article)} 
                  className={`admin-news-status ${article.published ? 'published' : 'draft'}`}
                >
                  {article.published ? <Globe size={14} /> : <EyeOff size={14} />}
                  {article.published ? 'Published' : 'Draft'}
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default NewsManagement;
