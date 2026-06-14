import { useAuthStore } from "@/features/auth/auth.store"
import { Navigate, Outlet, useLocation } from "react-router"
import Navbar from "@/components/navbar"

const PrivateLayout = () => {
  const token = useAuthStore((s) => s.token)
  const user = useAuthStore((s) => s.user)
  const location = useLocation()

  if (!token || !user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}

export default PrivateLayout