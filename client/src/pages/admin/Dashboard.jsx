import { useState, useEffect } from 'react';
import { getDashboardStats } from '../../services/userService';
import { getVideoStats } from '../../services/videoService';
import { getNewsStats } from '../../services/newsService';
import StatCard from '../../components/common/StatCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Users, UserCheck, UserX, Video, Eye, Newspaper, MessageSquare } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [userRes, videoRes, newsRes] = await Promise.all([
          getDashboardStats(),
          getVideoStats(),
          getNewsStats()
        ]);
        
        setStats({
          users: userRes.data.stats,
          videos: videoRes.data.stats,
          news: newsRes.data.stats
        });
      } catch (error) {
        console.error('Failed to fetch dashboard stats', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <LoadingSpinner fullScreen />;
  if (!stats) return null;

  const chartData = [
    { name: 'Pending', count: stats.users.pendingUsers },
    { name: 'Approved', count: stats.users.approvedUsers },
    { name: 'Rejected', count: stats.users.rejectedUsers },
    { name: 'Suspended', count: stats.users.suspendedUsers },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary">Dashboard Overview</h1>
        <p className="text-secondary text-sm">Welcome back to the TradNex admin panel.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Users" value={stats.users.totalUsers} icon={Users} color="blue" />
        <StatCard title="Pending Approvals" value={stats.users.pendingUsers} icon={UserCheck} color="yellow" trend={`${stats.users.pendingUsers} need review`} trendUp={false} />
        <StatCard title="Total Classes" value={stats.videos.total} icon={Video} color="purple" />
        <StatCard title="Published News" value={stats.news.published} icon={Newspaper} color="emerald" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-bold text-primary mb-6">User Status Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)' }} />
                <Tooltip 
                  cursor={{ fill: 'var(--bg-glass)' }}
                  contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', borderRadius: '0.5rem', color: 'var(--text-primary)' }}
                />
                <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-bold text-primary mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <a href="/admin/users" className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-center hover:bg-blue-500/20 transition-colors">
              <UserCheck size={24} className="text-blue-500 mx-auto mb-2" />
              <p className="font-semibold text-blue-600 dark:text-blue-400">Review Users</p>
            </a>
            <a href="/admin/videos" className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 text-center hover:bg-purple-500/20 transition-colors">
              <Video size={24} className="text-purple-500 mx-auto mb-2" />
              <p className="font-semibold text-purple-600 dark:text-purple-400">Manage Classes</p>
            </a>
            <a href="/admin/access" className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center hover:bg-emerald-500/20 transition-colors">
              <Eye size={24} className="text-emerald-500 mx-auto mb-2" />
              <p className="font-semibold text-emerald-600 dark:text-emerald-400">Video Access</p>
            </a>
            <a href="/admin/messages" className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-center hover:bg-rose-500/20 transition-colors">
              <MessageSquare size={24} className="text-rose-500 mx-auto mb-2" />
              <p className="font-semibold text-rose-600 dark:text-rose-400">Check Messages</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
