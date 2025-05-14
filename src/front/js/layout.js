import React, { useEffect, useState, useContext } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";
import { BackendURL } from "./component/backendURL";
import { Context } from './store/appContext.js';
import HelpPlaces from './pages/HelpPlaces.jsx';
import Embassies from './pages/Embassies.jsx';
import Chat from './pages/Chat.jsx';
import Blog from './pages/Blog.jsx';
import Gadgets from './pages/Gadgets.jsx';
import ChatBot from './pages/ChatBot.jsx';
import ContactList from './pages/ContactList.jsx';
import ImmigrationRequirements from './pages/ImmigrationRequirements.jsx';
import PaypalBalance from './pages/PaypalBalance.jsx';
import FreqAskedQuestions from './pages/FreqAskedQuestions.jsx';
import Emergency from './pages/Emergency.jsx';
import StatsAndReports from './pages/StatsAndReports.jsx';
import Help from './pages/Help.jsx';
import LocationView from './pages/LocationView.jsx';
import AdminConsole from './pages/AdminConsole.jsx';
import DashboardEdition from './pages/DashboardEdition.jsx';
import injectContext from "./store/appContext";
import Home from "./pages/Home.jsx";
import Navbar from "./component/Navbar.jsx";
import Footer from "./component/Footer.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import ResetPassword from "./component/ResetPassword.jsx";
import ForgotPassword from "./component/ForgotPassword.jsx";
import PaypalBalance2 from "./pages/PaypalBalance2.jsx"
import Complaint from "./pages/Complaint.jsx";
import Adopt from "./pages/Adopt.jsx";
import Expediente from "./pages/Expediente.jsx";
import MapIne from "./pages/MapIne.jsx";
import OCRDesdeCamara from "./pages/OCRDesdeCamara.jsx";

const Layout = () => {
    const [token, setToken] = useState(localStorage.getItem("token"));
    const { store } = useContext(Context);

    // Sincronizar el token con el localStorage
    useEffect(() => {
        const handleStorageChange = () => {
            const newToken = localStorage.getItem("token");
            if (newToken !== token) {
                setToken(newToken);
            }
        };

        // Escuchar cambios en el localStorage
        window.addEventListener('storage', handleStorageChange);

        // Verificar el token periódicamente
        const interval = setInterval(() => {
            const currentToken = localStorage.getItem("token");
            if (currentToken !== token) {
                setToken(currentToken);
            }
        }, 1000);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            clearInterval(interval);
        };
    }, [token]);



    return (
        <BrowserRouter>
            <ScrollToTop>
                {/* {!token ? ( */}
                {/* <Routes> */}

                {/* </Routes> */}
                {/* ) : ( */}
                <Navbar />
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Register />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/paypal-balance" element={<PaypalBalance />} />
                    <Route path="/" element={<Navigate to="/home" replace />} />
                    <Route path="/paypal-balance2" element={<PaypalBalance2 />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/chat" element={<Chat />} />
                    <Route path="/help-places" element={<HelpPlaces />} />
                    <Route path="/embassies" element={<Embassies />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/gadgets" element={<Gadgets />} />
                    <Route path="/ocr" element={<OCRDesdeCamara />} />
                    <Route path="/chatbot" element={<ChatBot />} />
                    <Route path="/contact-list" element={<ContactList />} />
                    <Route path="/immigration-requirements" element={<ImmigrationRequirements />} />
                    <Route path="/freq-asked-questions" element={<FreqAskedQuestions />} />
                    <Route path="/emergency" element={<Emergency />} />
                    <Route path="/stats-and-reports" element={<StatsAndReports />} />
                    <Route path="/help" element={<Help />} />
                    <Route path="/location-view" element={<LocationView />} />
                    <Route path="/admin-console" element={<AdminConsole />} />
                    <Route path="/complaint" element={<Complaint />} />
                    <Route path="/dashboard-edition" element={<DashboardEdition />} />
                    <Route path="/mapine" element={<MapIne />} />
                    <Route path="/adopt" element={<Adopt />} />
                    <Route path="/expediente" element={<Expediente />} />
                    <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
                {/* </div> */}
                <Footer style={{ position: "sticky", bottom: 0, zIndex: 1000 }} />
                {/* )} */}
            </ScrollToTop>
        </BrowserRouter>
    );
};



export default injectContext(Layout);
