import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from '../pages/Login';
import PrivateRoute from "./PrivateRoutes";
import NotFound from "../pages/NotFound";
import AdminDashboard from "../pages/AdminDashboard";
import AddClient from "../features/admin/AddClient";

const AppRouter = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />

                <Route
                path="/dash-admin"
                element={
                    <PrivateRoute>
                        <AdminDashboard />
                    </PrivateRoute>
                }
                />

                <Route
                path="/dash-admin/add-client"
                element={
                    <PrivateRoute>
                        <AddClient />
                    </PrivateRoute>
                }
                />


                {/* <Route 
                path="/dashboard/edit" 
                element={
                    <PrivateRoute>
                        <MarkdownEditor />
                    </PrivateRoute>
                }
                />

                <Route 
                path="/dashboard/detail/:id" 
                element={
                    <PrivateRoute>
                        <LessonDetail />
                    </PrivateRoute>
                } 
                /> */}

                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
    );
};

export default AppRouter;