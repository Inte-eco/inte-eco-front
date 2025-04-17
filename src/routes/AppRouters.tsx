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
// import UserProfile from "../features/dashboard/UserProfile";
import AdminProfile from "../features/admin/AdminProfile";
import ManageClient from "../features/admin/ManageClient";
import EditClient from "../features/admin/EditClient";
import ManageStation from "../features/admin/ManageStation";
import EditStation from "../features/admin/EditStation";
import ManageUser from "../features/admin/ManageUser";
import EditUser from "../features/admin/EditUser";

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
                {/* <Route
                    path="/profile"
                    element={
                        <PrivateRoutes>
                            <UserProfile />
                        </PrivateRoutes>
                    }
                /> */}

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
                <Route
                    path="/dash-admin/manage-client"
                    element={
                        <PrivateRoutes>
                        <div className="flex flex-col h-screen">
                            <Navbar />
                            <div className="flex flex-1">
                            <Sidebar />
                            <main className="flex-1 p-6 bg-gray-100 overflow-y-auto">
                                <ManageClient />
                            </main>
                            </div>
                        </div>
                        </PrivateRoutes>
                    }
                />
                <Route
                    path="/dash-admin/manage-client/edit/:clientId"
                    element={
                        <PrivateRoutes>
                        <div className="flex flex-col h-screen">
                            <Navbar />
                            <div className="flex flex-1">
                            <Sidebar />
                            <main className="flex-1 p-6 bg-gray-100 overflow-y-auto">
                                <EditClient />
                            </main>
                            </div>
                        </div>
                        </PrivateRoutes>
                    }
                />
                <Route
                    path="/dash-admin/manage-station"
                    element={
                        <PrivateRoutes>
                        <div className="flex flex-col h-screen">
                            <Navbar />
                            <div className="flex flex-1">
                            <Sidebar />
                            <main className="flex-1 p-6 bg-gray-100 overflow-y-auto">
                                <ManageStation />
                            </main>
                            </div>
                        </div>
                        </PrivateRoutes>
                    }
                />
                <Route
                    path="/dash-admin/manage-station/edit/:stationId"
                    element={
                        <PrivateRoutes>
                        <div className="flex flex-col h-screen">
                            <Navbar />
                            <div className="flex flex-1">
                            <Sidebar />
                            <main className="flex-1 p-6 bg-gray-100 overflow-y-auto">
                                <EditStation />
                            </main>
                            </div>
                        </div>
                        </PrivateRoutes>
                    }
                />
                <Route
                    path="/dash-admin/manage-user"
                    element={
                        <PrivateRoutes>
                        <div className="flex flex-col h-screen">
                            <Navbar />
                            <div className="flex flex-1">
                            <Sidebar />
                            <main className="flex-1 p-6 bg-gray-100 overflow-y-auto">
                                <ManageUser/>
                            </main>
                            </div>
                        </div>
                        </PrivateRoutes>
                    }
                />
                <Route
                    path="/dash-admin/manage-user/edit/:userId"
                    element={
                        <PrivateRoutes>
                        <div className="flex flex-col h-screen">
                            <Navbar />
                            <div className="flex flex-1">
                            <Sidebar />
                            <main className="flex-1 p-6 bg-gray-100 overflow-y-auto">
                                <EditUser/>
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
