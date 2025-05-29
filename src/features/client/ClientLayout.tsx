import { Outlet } from 'react-router-dom';
import Navbar from '../../components/NavBar';
import ClientSidebar from './ClientSidebar';
const ClientLayout = () => (
  <div className="flex flex-col h-screen">
    <Navbar />
    <div className="flex flex-1">
      <ClientSidebar />
      <main className="flex-1 p-6 bg-gray-100 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  </div>
);

export default ClientLayout;