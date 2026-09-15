import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import LoadingSpinner from './components/common/LoadingSpinner';

// Layouts
import UserLayout from './layouts/UserLayout';
import AdminLayout from './layouts/AdminLayout';

// Route Guards
import ProtectedRoute from './routes/ProtectedRoute';
import AdminRoute from './routes/AdminRoute';

// User Pages
import Home from './pages/user/Home';
import Login from './pages/user/Login';
import Signup from './pages/user/Signup';
import Classes from './pages/user/Classes';
import ClassDetails from './pages/user/ClassDetails';
import News from './pages/user/News';
import Contact from './pages/user/Contact';
import Profile from './pages/user/Profile';

// Admin Pages
import Dashboard from './pages/admin/Dashboard';
import Users from './pages/admin/Users';
import UserDetails from './pages/admin/UserDetails';
import Videos from './pages/admin/Videos';
import VideoAccess from './pages/admin/VideoAccess';
import NewsManagement from './pages/admin/NewsManagement';
import Messages from './pages/admin/Messages';
import Settings from './pages/admin/Settings';

// Fallback logic for logged in users trying to hit login/signup
const AuthGuard = ({ children }) => {
  const { user, loading, isAdmin } = useAuth();
  if (loading) return <LoadingSpinner fullScreen />;
  if (user) {
    return <Navigate to={isAdmin ? "/admin" : "/"} replace />;
  }
  return children;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Auth Routes */}
            <Route path="/login" element={<AuthGuard><Login /></AuthGuard>} />
            <Route path="/signup" element={<AuthGuard><Signup /></AuthGuard>} />

            {/* User Routes */}
            <Route path="/" element={<UserLayout />}>
              <Route index element={<Home />} />
              <Route path="classes" element={<Classes />} />
              <Route path="classes/:id" element={<ProtectedRoute><ClassDetails /></ProtectedRoute>} />
              <Route path="news" element={<News />} />
              <Route path="contact" element={<Contact />} />
              <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
              <Route index element={<Dashboard />} />
              <Route path="users" element={<Users />} />
              <Route path="users/:id" element={<UserDetails />} />
              <Route path="videos" element={<Videos />} />
              <Route path="access" element={<VideoAccess />} />
              <Route path="news" element={<NewsManagement />} />
              <Route path="messages" element={<Messages />} />
              <Route path="settings" element={<Settings />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
