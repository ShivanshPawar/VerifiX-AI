import { Routes , Route } from "react-router-dom";
import Landing from "../pages/Landing";
import SignUp from './../pages/SignUp';
import SignIn from './../pages/SignIn';

const AppRoutes = () => {
    return(
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/signup" element={<SignUp/>}/>
                <Route path="/signin" element={<SignIn/>}/>
            </Routes>
    )
}

export default AppRoutes;