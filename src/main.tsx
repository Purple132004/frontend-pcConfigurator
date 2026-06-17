import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import AuthLayout from "./layouts/auth-layout";
import PrivateLayout from "./layouts/private-layout";
import AdminLayout from "./layouts/admin-layout";
import LoginPage from "./pages/login-page";
import RegisterPage from "./pages/register-page";
import "./index.css";
import ConfiguratorePage from "./pages/private/configuratore-page";
import ComponentsPage from "./pages/admin/components-page";
import DashboardPage from "./pages/admin/dashboard-page";
import BuildsPage from "./pages/private/builds-page";
import PreventiviPage from "./pages/private/preventivi-page";
import PreventiviAdminPage from "./pages/admin/preventivi-admin-page";
import UsersPage from "./pages/admin/users-page"
import BuildDetailPage from "./pages/private/builds-detail-page"

const client = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <PrivateLayout />,
    children: [
      {
        index: true,
        element: <ConfiguratorePage />,
      },
      {
        path: "builds",
        element: <BuildsPage />,
      },
      {
  path: "builds/:buildId",
  element: <BuildDetailPage />,
},
      {
        path: "preventivi",
        element: <PreventiviPage />,
      },
    ],
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: "components",
        element: <ComponentsPage />,
      },
      {
  path: "users",
  element: <UsersPage />,
},
      {
        path: "preventivi",
        element: <PreventiviAdminPage />,
      },
    ],
  },
  {
    path: "/login",
    element: <AuthLayout />,
    children: [
      {
        index: true,
        element: <LoginPage />,
      },
    ],
  },
  {
    path: "/register",
    element: <AuthLayout />,
    children: [
      {
        index: true,
        element: <RegisterPage />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={client}>
      <RouterProvider router={router} />
      <Toaster richColors
  toastOptions={{
    classNames: {
      success: "bg-green-500 text-white border-green-500",
      error: "bg-red-500 text-black border-red-500",
    },
  }}
/>
    </QueryClientProvider>
  </StrictMode>,
);
