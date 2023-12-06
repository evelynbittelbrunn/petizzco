import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login/Login";
import Profile from "./pages/Profile/Profile";

export default function Routering() {
    return (
        <Router>
            <Routes>
                <Route path="*" element={<Login />} />
                {/* <Route path="*" element={<Profile />} /> */}
                <Route path="/perfil" element={<Profile />} />
            </Routes>
        </Router>
    );
}