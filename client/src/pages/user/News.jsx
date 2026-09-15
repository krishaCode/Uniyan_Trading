import { useState, useEffect } from 'react';
import { getNews } from '../../services/newsService';
import NewsCard from '../../components/common/NewsCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Newspaper } from 'lucide-react';

const News = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const { data } = await getNews({ limit: 50 });
        setNews(data.news);
      } catch (error) {
        console.error('Failed to fetch news', error);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="news-page container min-h-screen">
      <div className="news-masthead">
        <div>
          <p className="news-kicker"><Newspaper size={15} /> MARKET INTELLIGENCE</p>
          <h1>News &amp; Updates</h1>
          <p className="news-lede">
            Stay informed with trading insights, platform updates, and course announcements built for your next decision.
          </p>
        </div>
        <div className="news-count">
          <strong>{news.length}</strong>
          <span>published updates</span>
        </div>
      </div>

      {news.length === 0 ? (
        <div className="text-center py-20 glass-card">
          <Newspaper className="mx-auto text-muted mb-4 opacity-50" size={64} />
          <h3 className="text-xl font-bold text-secondary">No updates yet.</h3>
          <p className="text-muted mt-2">Check back later for the latest news.</p>
        </div>
      ) : (
        <div className="news-grid">
          {news.map((article, index) => (
            <NewsCard key={article._id} article={article} index={index} />
          ))}
        </div>
      )}
    </div>
  );
};

export default News;
