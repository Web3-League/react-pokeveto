import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const useAuthenticatedPage = () => {
    const { isAuthenticated, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading) {
            if (!isAuthenticated) {
                navigate("/login");
            }
        }
    }, [isAuthenticated, loading, navigate]);

    return { isAuthenticated, loading };
}

export default useAuthenticatedPage;