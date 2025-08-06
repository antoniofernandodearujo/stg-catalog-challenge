import { LoginForm } from "@/src/components/auth/LoginForm"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"

export default function LoginPage() {
  return (
    <>
      <div className="min-h-screen flex items-center dark:bg-gray-900 justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold dark:text-white text-gray-900">STG Catalog</h1>
            <p className="mt-2 dark:text-white text-gray-600">Seu catálogo de produtos online</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Entrar na sua conta</CardTitle>
              <CardDescription>Digite suas credenciais para acessar o catálogo</CardDescription>
            </CardHeader>
            <CardContent>
              <LoginForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </>

  )
}
