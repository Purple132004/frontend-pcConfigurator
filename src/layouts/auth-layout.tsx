import { Card } from "@/components/ui/card"
import { useAuthStore } from "@/features/auth/auth.store"
import { Navigate, Outlet } from "react-router"

const AuthLayout = () => {
  const token = useAuthStore((state) => state.token)

  if (token) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="relative flex h-auto min-h-screen items-center justify-center px-4 py-10">
      <Card className="w-full border-none shadow-md sm:max-w-lg">
        <Outlet />
      </Card>
    </div>
  )
}

export default AuthLayout