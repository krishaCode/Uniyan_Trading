import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, Users, Video, ShieldCheck, 
  Newspaper, MessageSquare, Settings, LogOut, Menu, X
} from 'lucide-react';
import { useState } from 'react';
import ThemeToggle from '../components/common/ThemeToggle';

const AdminLayout = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Users', path: '/admin/users', icon: Users },
    { name: 'Videos / Classes', path: '/admin/videos', icon: Video },
    { name: 'Video Access', path: '/admin/access', icon: ShieldCheck },
    { name: 'News & Updates', path: '/admin/news', icon: Newspaper },
    { name: 'Messages', path: '/admin/messages', icon: MessageSquare },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="admin-shell min-h-screen bg-primary text-primary flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="admin-overlay fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`admin-sidebar fixed lg:sticky top-0 left-0 h-screen flex flex-col transition-transform duration-300 z-50 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="admin-brand">
          <div className="admin-brand-mark">T</div>
          <div>
            <span className="admin-brand-name">TradNex</span>
            <span className="admin-brand-label">Control center</span>
          </div>
          <button className="admin-close lg:hidden" onClick={() => setSidebarOpen(false)} aria-label="Close admin menu">
            <X size={24} />
          </button>
        </div>

        <div className="admin-nav-label">Workspace</div>
        <nav className="admin-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === '/admin'}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon size={20} />
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-theme-row">
            <span>Appearance</span>
            <ThemeToggle />
          </div>
          <div className="admin-user-card">
            <div className="admin-avatar">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div className="admin-user-copy">
              <p>{user?.name}</p>
              <span>Administrator</span>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="admin-logout"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="admin-mobile-header lg:hidden sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(true)} className="admin-menu-button" aria-label="Open admin menu">
            <Menu size={24} />
          </button>
          <div>
            <span>TradNex</span>
            <small>Admin workspace</small>
          </div>
        </header>

        <div className="admin-content flex-1 overflow-y-auto bg-primary">
          <div className="admin-content-inner page-shell">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
