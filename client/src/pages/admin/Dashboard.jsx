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
    <div className="admin-dashboard">
      <div className="dashboard-heading">
        <div>
          <p className="dashboard-kicker">ADMIN WORKSPACE</p>
          <h1>Dashboard overview</h1>
          <p>Monitor learner activity, course content, and the latest platform signals.</p>
        </div>
        <div className="dashboard-status"><span /> System operational</div>
      </div>

      <div className="dashboard-kpis">
        <StatCard title="Total Users" value={stats.users.totalUsers} icon={Users} color="blue" />
        <StatCard title="Pending Approvals" value={stats.users.pendingUsers} icon={UserCheck} color="yellow" trend={`${stats.users.pendingUsers} need review`} trendUp={false} />
        <StatCard title="Total Classes" value={stats.videos.total} icon={Video} color="purple" />
        <StatCard title="Published News" value={stats.news.published} icon={Newspaper} color="emerald" />
      </div>

      <div className="dashboard-main-grid">
        <div className="dashboard-panel dashboard-chart-panel">
          <div className="dashboard-panel-heading">
            <div>
              <p className="dashboard-panel-kicker">LEARNER HEALTH</p>
              <h2>User status distribution</h2>
            </div>
            <span className="dashboard-panel-note">Current accounts</span>
          </div>
          <div className="dashboard-chart">
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

        <div className="dashboard-panel dashboard-actions-panel">
          <div className="dashboard-panel-heading">
            <div>
              <p className="dashboard-panel-kicker">SHORTCUTS</p>
              <h2>Quick actions</h2>
            </div>
            <span className="dashboard-panel-note">Manage workspace</span>
          </div>
          <div className="dashboard-actions">
            <a href="/admin/users" className="dashboard-action dashboard-action-blue">
              <span className="dashboard-action-icon"><UserCheck size={21} /></span>
              <span><strong>Review users</strong><small>Approve new accounts</small></span>
            </a>
            <a href="/admin/videos" className="dashboard-action dashboard-action-purple">
              <span className="dashboard-action-icon"><Video size={21} /></span>
              <span><strong>Manage classes</strong><small>Update video lessons</small></span>
            </a>
            <a href="/admin/access" className="dashboard-action dashboard-action-emerald">
              <span className="dashboard-action-icon"><Eye size={21} /></span>
              <span><strong>Video access</strong><small>Manage permissions</small></span>
            </a>
            <a href="/admin/messages" className="dashboard-action dashboard-action-rose">
              <span className="dashboard-action-icon"><MessageSquare size={21} /></span>
              <span><strong>Check messages</strong><small>Read support requests</small></span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
