import React, { useContext } from "react";
import { useLocation } from "react-router-dom";
import UserContext from "../../userContext";
import Navbar from "./navbar/navbar";
import AdminNavbar from "./navbar/adminNavbar";
import UserNavbar from "./navbar/UserNavbar";
import InstructorNavbar from "./navbar/instructorNavbar";



export default function Layout({ children }) {
    const { user } = useContext(UserContext);
    const location = useLocation();

    const hideNavbarPaths = ["/adminLogin", "/notFound", "/login", "/register"];
    if (hideNavbarPaths.includes(location.pathname)) return <>{children}</>;

    const renderNavbar = () => {
        if (!user) return <Navbar />;
        if (user.role === "admin") return <AdminNavbar />;
        if (location.pathname.startsWith("/learningDashboard")) return null;
        if (user.role === "user") return <UserNavbar />;
        return null;
    };

    return (
        <>
            {renderNavbar()}
            {children}
        </>
    );
}
