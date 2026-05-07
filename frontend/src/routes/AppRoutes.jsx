import { Routes, Route } from "react-router-dom";
import Landing from "../pages/Landing";
import SignUp from './../pages/SignUp';
import SignIn from './../pages/SignIn';
import Scan from "../pages/Scan";
import History from "../pages/History";
import HistoryDetail from "../pages/HistoryDetail";
import Dashboard from "../pages/Dashboard";
import ProtectedRoute from "./ProtectedRoute";

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/scan" element={<Scan />} />
            <Route
                path="/history"
                element={
                    <ProtectedRoute>
                        <History />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/history/:id"
                element={
                    <ProtectedRoute>
                        <HistoryDetail />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                }
            />
        </Routes>
    )
}

export default AppRoutes;