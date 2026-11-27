import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, CalendarDays, Clock3, Newspaper, Tag, UserRound } from 'lucide-react';
import { getNewsById } from '../../services/newsService';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const formatDate = (value) => {
  if (!value) return 'Recently published';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Recently published';

  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

const NewsArticle = () => {
  const { id } = useParams();
  const [result, setResult] = useState({ id: null, article: null, error: '' });
  const [failedImageUrl, setFailedImageUrl] = useState('');

  useEffect(() => {
    let active = true;

    getNewsById(id)
      .then(({ data }) => {
        if (active) setResult({ id, article: data.article, error: '' });
      })
      .catch((requestError) => {
        if (!active) return;
        setResult({
          id,
          article: null,
          error: requestError.response?.status === 404
            ? 'This article could not be found or is no longer available.'
            : 'We could not load this article. Please try again.',
        });
      });

    return () => {
      active = false;
    };
  }, [id]);

  const currentResult = result.id === id ? result : null;
  const loading = !currentResult;
  const article = currentResult?.article;
  const error = currentResult?.error || '';

  if (loading) return <LoadingSpinner fullScreen />;

  if (error || !article) {
    return (
      <div className="news-detail-state container">
        <span className="news-detail-state-icon"><Newspaper size={25} /></span>
        <p className="news-kicker">MARKET INTELLIGENCE</p>
        <h1>Article unavailable</h1>
        <p>{error || 'This article could not be found or is no longer available.'}</p>
        <Link to="/news" className="news-detail-back">
          <ArrowLeft size={17} /> Back to News &amp; Updates
        </Link>
      </div>
    );
  }

  const articleDate = article.publishedAt || article.createdAt;
  const wordCount = article.content?.trim().split(/\s+/).filter(Boolean).length || 0;
  const readingMinutes = Math.max(1, Math.ceil(wordCount / 220));
  const authorName = article.author?.name || 'TradNex Editorial';
  const tags = Array.isArray(article.tags) ? article.tags.filter(Boolean) : [];
  const hasCoverImage = article.image && failedImageUrl !== article.image;

  return (
    <main className="news-detail-page container">
      <Link to="/news" className="news-detail-back">
        <ArrowLeft size={17} /> All news &amp; updates
      </Link>

      <header className="news-detail-header">
        <div className="news-detail-eyebrow">
          <span className="news-detail-category">{article.category || 'Announcement'}</span>
          <span className="news-detail-edition">TRADNEX / EDITORIAL</span>
        </div>
        <h1>{article.title}</h1>
        {article.excerpt && <p className="news-detail-excerpt">{article.excerpt}</p>}

        <div className="news-detail-meta">
          <span><CalendarDays size={16} />{formatDate(articleDate)}</span>
          <span><UserRound size={16} />{authorName}</span>
          <span><Clock3 size={16} />{readingMinutes} min read</span>
        </div>
      </header>

      <figure className={`news-detail-cover ${hasCoverImage ? 'has-cover-image' : ''}`}>
        {hasCoverImage ? (
          <img
            src={article.image}
            alt={article.title}
            onError={() => setFailedImageUrl(article.image)}
          />
        ) : (
          <div className="news-detail-cover-placeholder">
            <Newspaper size={42} />
            <span>TradNex Market Intelligence</span>
          </div>
        )}
        <figcaption>
          <span>{article.category || 'Announcement'}</span>
          <span>{formatDate(articleDate)}</span>
        </figcaption>
      </figure>

      <div className="news-detail-layout">
        <article className="news-detail-story">
          <div className="news-detail-story-heading">
            <span className="news-kicker"><Newspaper size={15} /> THE FULL STORY</span>
            <h2>{article.title}</h2>
          </div>
          <div className="news-detail-content">{article.content}</div>
          <footer className="news-detail-story-footer">
            <span>End of article</span>
            <Link to="/news"><ArrowLeft size={16} /> Explore more updates</Link>
          </footer>
        </article>

        <aside className="news-detail-sidebar">
          <section className="news-detail-info-card">
            <p className="news-detail-sidebar-label">STORY DETAILS</p>
            <h2>At a glance</h2>
            <dl>
              <div><dt>Category</dt><dd>{article.category || 'Announcement'}</dd></div>
              <div><dt>Published</dt><dd>{formatDate(articleDate)}</dd></div>
              <div><dt>Written by</dt><dd>{authorName}</dd></div>
              <div><dt>Reading time</dt><dd>{readingMinutes} min</dd></div>
            </dl>
            {tags.length > 0 && (
              <div className="news-detail-tags">
                <p><Tag size={14} /> TOPICS</p>
                <div>{tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
              </div>
            )}
          </section>
          <section className="news-detail-newsletter">
            <span><Newspaper size={18} /></span>
            <h2>Stay in the know</h2>
            <p>Explore more trading insights, course updates, and announcements.</p>
            <Link to="/news">Browse all updates <ArrowLeft size={15} /></Link>
          </section>
        </aside>
      </div>
    </main>
  );
};

export default NewsArticle;
