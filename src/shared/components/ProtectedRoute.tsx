import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";

export const ProtectedRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Проверяем наличие токена в localStorage
    const token = localStorage.getItem("accessToken");
    setIsAuthenticated(!!token);
    setIsLoading(false);

    // Слушаем изменения в localStorage
    const handleStorageChange = () => {
      const updatedToken = localStorage.getItem("accessToken");
      setIsAuthenticated(!!updatedToken);
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  if (isLoading) {
    // Можно показать лоадер во время проверки
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <div>Проверка авторизации...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Сохраняем текущий путь для возврата после авторизации
    const currentPath = window.location.pathname + window.location.search;
    sessionStorage.setItem("redirectPath", currentPath);

    return <Navigate to="/auth/login" replace />;
  }

  return <Outlet />;
};

export const AuthRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setIsAuthenticated(!!token);
    setIsLoading(false);

    const handleStorageChange = () => {
      const updatedToken = localStorage.getItem("accessToken");
      setIsAuthenticated(!!updatedToken);
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <div>Загрузка...</div>
      </div>
    );
  }

  if (isAuthenticated) {
    // Если пользователь уже авторизован, перенаправляем на главную
    const redirectPath = sessionStorage.getItem("redirectPath") || "/";
    sessionStorage.removeItem("redirectPath");

    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};
