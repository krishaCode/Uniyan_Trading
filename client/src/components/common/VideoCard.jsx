import { Link } from 'react-router-dom';
import { Calendar, Clock, PlayCircle, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

const VideoCard = ({ video, hasAccess = true, index = 0 }) => {
  const { _id, title, classNumber, description, thumbnail, classDate, startTime, duration } = video;
  
  const formattedDate = classDate ? new Date(classDate).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'long', year: 'numeric'
  }) : 'TBA';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="card card-3d overflow-hidden group flex flex-col h-full"
    >
      <div className="relative aspect-video overflow-hidden">
        <img 
          src={thumbnail || `https://source.unsplash.com/random/800x450/?trading,finance&sig=${_id}`} 
          alt={title} 
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${!hasAccess ? 'grayscale blur-sm' : ''}`}
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800'; }}
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        
        {/* Class Badge */}
        <div className="absolute top-3 left-3 bg-blue-600/90 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-lg border border-blue-400/30">
          Class {String(classNumber).padStart(2, '0')}
        </div>
        
        {/* Play / Lock Icon */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {hasAccess ? (
            <div className="w-16 h-16 rounded-full bg-blue-600/80 backdrop-blur-sm flex items-center justify-center text-white border-2 border-white/50 shadow-lg shadow-blue-500/50 transform scale-75 group-hover:scale-100 transition-transform duration-300">
              <PlayCircle size={32} />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-full bg-red-600/80 backdrop-blur-sm flex items-center justify-center text-white border-2 border-white/50 shadow-lg shadow-red-500/50">
              <Lock size={32} />
            </div>
          )}
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-xl font-bold text-primary mb-2 line-clamp-1 group-hover:text-blue-500 transition-colors">{title}</h3>
        
        <p className="text-sm text-secondary line-clamp-2 mb-4 flex-1">
          {description || 'No description available for this class.'}
        </p>

        <div className="grid grid-cols-2 gap-3 text-xs text-muted mb-5 bg-glass p-3 rounded-xl border border-theme">
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-blue-500" />
            <span className="truncate">{formattedDate}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={14} className="text-blue-500" />
            <span>{startTime || 'TBA'}</span>
          </div>
          <div className="flex items-center gap-2 col-span-2">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
            <span>Duration: {duration || 'N/A'}</span>
          </div>
        </div>

        {hasAccess ? (
          <Link to={`/classes/${_id}`} className="btn-primary w-full text-center">
            Watch Video &rarr;
          </Link>
        ) : (
          <button disabled className="w-full py-2.5 rounded-xl bg-gray-500/10 text-gray-500 font-semibold border border-gray-500/20 cursor-not-allowed flex items-center justify-center gap-2">
            <Lock size={16} /> Access Denied
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default VideoCard;
