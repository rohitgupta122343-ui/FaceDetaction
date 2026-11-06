import { useCallback, useContext, useEffect } from "react";
import { AuthContext } from "../auth-context";
import { getMe, login, logout, register } from "../services/auth.service";

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider.");
    }

    const { user, loading, setloading, setuser } = context;

    const handleLogin = async ({ username, email, password }) => {
        setloading(true);
        try {
            const response = await login({ username, email, password });
            setuser(response.user);
            return response.user;
        } finally {
            setloading(false);
        }
    };

    const handleRegister = async ({ username, email, password }) => {
        setloading(true);
        try {
            const response = await register({ username, email, password });
            setuser(response.user);
            return response.user;
        } finally {
            setloading(false);
        }
    };

    const handleGetMe = useCallback(async () => {
        setloading(true);
        try {
            const response = await getMe();
            setuser(response.user);
            return response.user;
        } catch {
            setuser(null);
            return null;
        } finally {
            setloading(false);
        }
    }, [setloading, setuser]);

    const handleLogout = async () => {
        setloading(true);
        try {
            await logout();
            setuser(null);
        } finally {
            setloading(false);
        }
    };

    useEffect(() => {
        handleGetMe();
    }, [handleGetMe]);

    return {
        user,
        loading,
        handleLogin,
        handleRegister,
        handleGetMe,
        handleLogout
    };
}