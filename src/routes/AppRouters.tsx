import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from '../pages/Login';
import PrivateRoutes from "./PrivateRoutes";
import NotFound from "../pages/NotFound";
import AdminDashboard from "../pages/AdminDashboard";
import AddClient from "../features/admin/AddClient";
import ClientDashboard from "../pages/ClientDashboard";
import Navbar from "../components/NavBar";
import Sidebar from "../components/Sidebar";
import AddAdmin from "../features/admin/AddAdim";
import AddUser from "../features/admin/AddUser";
import AddStation from "../features/admin/AddStation";
import UserProfile from "../features/dashboard/UserProfile";
import AdminProfile from "../features/admin/AdminProfile";

const AppRouter = () => {
    return (
        <Router>
            <Routes>
                {/* Login Route */}
                <Route path="/" element={<Login />} />
                {/* 404 Route */}
                <Route path="*" element={<NotFound />} />

                {/* Client Dashboard Route (without Navbar & Sidebar) */}
                <Route
                    path="/dashboard"
                    element={
                        <PrivateRoutes>
                            <ClientDashboard />
                        </PrivateRoutes>
                    }
                />

                {/* Client Dashboard Route (without Navbar & Sidebar) */}
                <Route
                    path="/profile"
                    element={
                        <PrivateRoutes>
                            <UserProfile />
                        </PrivateRoutes>
                    }
                />

                {/* Admin Dashboard and Admin Routes (with Navbar & Sidebar) */}
                <Route
                    path="/dash-admin"
                    element={
                        <PrivateRoutes>
                        <div className="flex flex-col h-screen">
                            <Navbar />
                            <div className="flex flex-1">
                            <Sidebar />
                            <main className="flex-1 p-6 bg-gray-100 overflow-y-auto">
                                <AdminDashboard />
                            </main>
                            </div>
                        </div>
                        </PrivateRoutes>
                    }
                />
                <Route
                    path="/dash-admin/add-client"
                    element={
                        <PrivateRoutes>
                        <div className="flex flex-col h-screen">
                            <Navbar />
                            <div className="flex flex-1">
                            <Sidebar />
                            <main className="flex-1 p-6 bg-gray-100 overflow-y-auto">
                                <AddClient />
                            </main>
                            </div>
                        </div>
                        </PrivateRoutes>
                    }
                />
                <Route
                    path="/dash-admin/add-admin"
                    element={
                        <PrivateRoutes>
                        <div className="flex flex-col h-screen">
                            <Navbar />
                            <div className="flex flex-1">
                            <Sidebar />
                            <main className="flex-1 p-6 bg-gray-100 overflow-y-auto">
                                <AddAdmin />
                            </main>
                            </div>
                        </div>
                        </PrivateRoutes>
                    }
                />
                <Route
                    path="/dash-admin/add-user"
                    element={
                        <PrivateRoutes>
                        <div className="flex flex-col h-screen">
                            <Navbar />
                            <div className="flex flex-1">
                            <Sidebar />
                            <main className="flex-1 p-6 bg-gray-100 overflow-y-auto">
                                <AddUser />
                            </main>
                            </div>
                        </div>
                        </PrivateRoutes>
                    }
                />
                <Route
                    path="/dash-admin/add-station"
                    element={
                        <PrivateRoutes>
                        <div className="flex flex-col h-screen">
                            <Navbar />
                            <div className="flex flex-1">
                            <Sidebar />
                            <main className="flex-1 p-6 bg-gray-100 overflow-y-auto">
                                <AddStation />
                            </main>
                            </div>
                        </div>
                        </PrivateRoutes>
                    }
                />
                <Route
                    path="/dash-admin/profile"
                    element={
                        <PrivateRoutes>
                        <div className="flex flex-col h-screen">
                            <Navbar />
                            <div className="flex flex-1">
                            <Sidebar />
                            <main className="flex-1 p-6 bg-gray-100 overflow-y-auto">
                                <AdminProfile />
                            </main>
                            </div>
                        </div>
                        </PrivateRoutes>
                    }
                />
            </Routes>
        </Router>
    );
};

export default AppRouter;
