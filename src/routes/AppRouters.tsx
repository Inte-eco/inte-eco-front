import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import PrivateRoutes from "./PrivateRoutes";
import NotFound from "../pages/NotFound";
import AdminDashboard from "../pages/AdminDashboard";
import AddClient from "../features/admin/AddClient";
import ClientDashboard from "../pages/ClientDashboard";
import AddAdmin from "../features/admin/AddAdim";
import AddUser from "../features/admin/AddUser";
import AddStation from "../features/admin/AddStation";
import AdminProfile from "../features/admin/AdminProfile";
import ManageClient from "../features/admin/ManageClient";
import EditClient from "../features/admin/EditClient";
import ManageStation from "../features/admin/ManageStation";
import EditStation from "../features/admin/EditStation";
import ManageUser from "../features/admin/ManageUser";
import EditUser from "../features/admin/EditUser";
import ManageAdmin from "../features/admin/ManageAdmin";
import AdminLayout from "../components/AdminLayout";
import EditAdmin from "../features/admin/EditAdmin";
import Statistic from "../features/admin/Statistic";
import ClientLayout from "../features/client/ClientLayout";

const AppRouter = () => {
    return (
        <Router>
            <Routes>
                {/* Login & 404 */}
                <Route path="/" element={<Login />} />
                <Route path="*" element={<NotFound />} />

                {/* Client Dashboard */}
                <Route
                    path="/dashboard"
                    element={
                        <PrivateRoutes>
                            <ClientLayout />
                        </PrivateRoutes>
                    }
                >
                    <Route index element={<ClientDashboard />} />
                    <Route path="show-users" element={<AddClient />} />
                    <Route path="user-profil" element={<AddClient />} />
                </Route>

                {/* Admin routes with layout & protection */}
                <Route
                    path="/dash-admin"
                    element={
                        <PrivateRoutes>
                            <AdminLayout />
                        </PrivateRoutes>
                    }
                >
                    <Route index element={<AdminDashboard />} />
                    <Route path="add-client" element={<AddClient />} />
                    <Route path="add-user" element={<AddUser />} />
                    <Route path="add-admin" element={<AddAdmin />} />
                    <Route path="add-station" element={<AddStation />} />
                    <Route path="profile" element={<AdminProfile />} />
                    <Route path="manage-client" element={<ManageClient />} />
                    <Route path="manage-client/edit/:clientId" element={<EditClient />} />
                    <Route path="manage-station" element={<ManageStation />} />
                    <Route path="manage-station/edit/:stationId" element={<EditStation />} />
                    <Route path="manage-user/users" element={<ManageUser />} />
                    <Route path="manage-user/admins" element={<ManageAdmin />} />
                    <Route path="manage-user/users/edit/:userId" element={<EditUser />} />
                    <Route path="manage-user/admins/edit/:adminId" element={<EditAdmin />} />
                    <Route path="statistic/" element={<Statistic />} />
                    <Route path="statistic/:stationId" element={<Statistic />} />
                </Route>
            </Routes>
        </Router>
    );
};

export default AppRouter;
