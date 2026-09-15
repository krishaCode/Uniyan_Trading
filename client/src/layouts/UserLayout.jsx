import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

const UserLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-primary text-primary transition-colors duration-300">
      <Navbar />
      <main className="flex-grow pt-20 overflow-hidden">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default UserLayout;
