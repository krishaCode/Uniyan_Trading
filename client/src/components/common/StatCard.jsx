import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon: Icon, color = 'blue', trend, trendUp }) => {
  const colors = {
    blue: 'from-blue-500/20 to-blue-600/5 text-blue-500 border-blue-500/20',
    green: 'from-emerald-500/20 to-emerald-600/5 text-emerald-500 border-emerald-500/20',
    yellow: 'from-amber-500/20 to-amber-600/5 text-amber-500 border-amber-500/20',
    red: 'from-rose-500/20 to-rose-600/5 text-rose-500 border-rose-500/20',
    purple: 'from-purple-500/20 to-purple-600/5 text-purple-500 border-purple-500/20',
  };

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className={`card p-6 border-l-4 relative overflow-hidden`}
      style={{ borderLeftColor: `var(--color-${color === 'green' ? 'emerald' : color === 'yellow' ? 'amber' : color === 'red' ? 'rose' : color}-500)` }}
    >
      <div className={`absolute top-0 right-0 w-32 h-32 rounded-bl-full bg-gradient-to-br ${colors[color]} opacity-20 -mr-8 -mt-8`}></div>
      
      <div className="flex items-start justify-between relative z-10">
        <div>
          <p className="text-sm font-medium text-secondary mb-1">{title}</p>
          <h4 className="text-3xl font-bold text-primary">{value}</h4>
          
          {trend && (
            <p className={`text-xs font-medium mt-2 flex items-center gap-1 ${trendUp ? 'text-emerald-500' : 'text-rose-500'}`}>
              <span className="text-lg leading-none">{trendUp ? '↑' : '↓'}</span> {trend}
            </p>
          )}
        </div>
        
        <div className={`p-3 rounded-xl bg-gradient-to-br ${colors[color]} border`}>
          <Icon size={24} />
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;
