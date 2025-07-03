import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const { user } = useSelector(store => store.auth);

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (user.role !== 'recruiter') {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;