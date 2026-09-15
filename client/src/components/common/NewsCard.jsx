import { Link } from 'react-router-dom';
import { Calendar, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const NewsCard = ({ article, index = 0 }) => {
  const { _id, title, excerpt, category, image, publishedAt } = article;
  
  const formattedDate = publishedAt ? new Date(publishedAt).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric'
  }) : 'Recent';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="news-card card group"
    >
      <div className="news-card-media">
        <img 
          src={image || `https://source.unsplash.com/random/800x400/?finance,news&sig=${_id}`} 
          alt={title}
          className="news-card-image"
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800'; }}
        />
        <div className="news-card-category">
          {category}
        </div>
      </div>
      
      <div className="news-card-body">
        <div className="news-card-date">
          <Calendar size={14} />
          <span>{formattedDate}</span>
        </div>
        
        <h3 className="news-card-title">
          {title}
        </h3>
        
        <p className="news-card-excerpt">
          {excerpt}
        </p>
        
        <Link 
          to={`/news/${_id}`} 
          className="news-card-link group/link"
        >
          Read Full Article 
          <ArrowRight size={16} className="transform group-hover/link:translate-x-1 transition-transform" />
        </Link>
      </div>
    </motion.div>
  );
};

export default NewsCard;
