// components/layouts/Layout.jsx
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

    // Optional: Paths where Navbar should be hidden completely
    const hideNavbarPaths = ["/adminLogin", "/notFound", "/login", "/register", "/instructorRegistor"];
    if (hideNavbarPaths.includes(location.pathname)) return <>{children}</>;

    // Role-based Navbar
    const renderNavbar = () => {
        if (!user) return <Navbar />;
        if (user.role === "admin") return <AdminNavbar />;
        if (user.role === "user") return <UserNavbar />;
        // No navbar for instructors
        if (user.role === "instructor") return <InstructorNavbar/>
        return null;
    };

    return (
        <>
            {renderNavbar()}
            {children}
        </>
    );
}
