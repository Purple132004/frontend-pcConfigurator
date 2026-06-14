import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AuthService } from "@/features/auth/auth.service"
import { toast } from "sonner"
import { useNavigate, Link } from "react-router"
import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"

const loginSchema = z.object({
  email: z.string().email("Email non valida"),
  password: z.string().min(8, "Password minimo 8 caratteri"),
})

type LoginForm = z.infer<typeof loginSchema>



const LoginPage = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginForm) => {
    setLoading(true)
    try {
      await AuthService.login(data)
      toast.success("Login effettuato con successo!")
      navigate("/")
    } catch {
      toast.error("Credenziali non valide")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <CardHeader>
        <CardTitle className="text-2xl">Accedi</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="mario@esempio.com"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-1">
  <Label htmlFor="password">Password</Label>
  <div className="relative">
    <Input
      id="password"
      type={showPassword ? "text" : "password"}
      placeholder="••••••••"
      {...register("password")}
    />
    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
    >
      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
    </button>
  </div>
  {errors.password && (
    <p className="text-sm text-destructive">{errors.password.message}</p>
  )}
</div>
          <Button type="submit" disabled={loading}>
            {loading ? "Accesso in corso..." : "Accedi"}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Non hai un account?{" "}
            <Link to="/register" className="text-foreground underline">
              Registrati
            </Link>
          </p>
        </form>
      </CardContent>
    </>
  )
}

export default LoginPage