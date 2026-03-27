import { Routes, Route } from "react-router-dom";
import Landing from "../pages/Landing";
import SignUp from './../pages/SignUp';
import SignIn from './../pages/SignIn';
import Scan from "../pages/Scan";
import History from "../pages/History";
import HistoryDetail from "../pages/HistoryDetail";

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/scan" element={<Scan />} />
            <Route path="/history" element={<History />} />
            <Route path="/history/:id" element={<HistoryDetail />} />
        </Routes>
    )
}

export default AppRoutes;