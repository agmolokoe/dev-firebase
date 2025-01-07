import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSearchParams, Link } from "react-router-dom";

interface AuthPageProps {
  mode?: "login" | "signup";
}

export default function AuthPage({ mode = "login" }: AuthPageProps) {
  const [searchParams] = useSearchParams();
  const currentMode = searchParams.get("mode") || mode;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(`${currentMode} submitted`, { email, password });
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left side - Image/Gradient */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-purple-600">
        <div className="m-auto text-white px-8 text-center">
          <h1 className="text-4xl font-bold mb-6">Welcome to Baseti ShopApp</h1>
          <p className="text-xl">Manage your business with ease and efficiency</p>
        </div>
      </div>

      {/* Right side - Auth form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold">
              {currentMode === "login" ? "Welcome back" : "Create your account"}
            </h2>
            <p className="mt-2 text-gray-600">
              {currentMode === "login"
                ? "Enter your details to access your account"
                : "Start your 30-day free trial"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="space-y-4">
              <div>
                <Input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12"
                />
              </div>
              <div>
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12"
                />
              </div>
            </div>

            {currentMode === "login" && (
              <div className="flex items-center justify-end">
                <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-500">
                  Forgot your password?
                </Link>
              </div>
            )}

            <Button type="submit" className="w-full h-12 text-lg">
              {currentMode === "login" ? "Sign in" : "Create account"}
            </Button>

            <p className="text-center text-sm text-gray-600">
              {currentMode === "login" ? (
                <>
                  Don't have an account?{" "}
                  <Link to="/auth?mode=signup" className="text-blue-600 hover:text-blue-500 font-medium">
                    Sign up
                  </Link>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <Link to="/auth?mode=login" className="text-blue-600 hover:text-blue-500 font-medium">
                    Sign in
                  </Link>
                </>
              )}
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}