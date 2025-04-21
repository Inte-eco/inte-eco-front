import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './NavBar';

const AdminLayout = () => (
  <div className="flex flex-col h-screen">
    <Navbar />
    <div className="flex flex-1">
      <Sidebar />
      <main className="flex-1 p-6 bg-gray-100 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  </div>
);

export default AdminLayout;

