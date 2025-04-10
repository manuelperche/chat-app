import { Link } from "react-router";
import { Loader2, Lock, Mail } from "lucide-react";
import AuthImagePattern from "../ui/AuthImagePatter";
import { useForm } from "react-hook-form";
import FormField from "../components/FormField";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import AuthLogo from "../ui/AuthLogo";
import { useNavigate } from "react-router";
import { useAuthStore } from "../store/useAuthStore";
import { LoginFormData } from "../types";

const LoginPage = () => {
  const { login, isLoggingIn } = useAuthStore();
  const navigate = useNavigate();
  const schema = z.object({
    email: z.string().email(),
    password: z
      .string()
      .min(6, { message: "Password is too short" })
      .max(20, { message: "Password is too long" }),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="h-screen grid lg:grid-cols-2">
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          <AuthLogo title="Welcome Back" subtitle="Sign in to your account" />

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              label="Email"
              type="email"
              name="email"
              placeholder="You@example.com"
              register={register}
              error={errors.email}
              icon={<Mail className="h-5 w-5 text-base-content/40" />}
            />

            <FormField
              label="Password"
              type="password"
              name="password"
              placeholder="Password"
              register={register}
              error={errors.password}
              icon={<Lock className="h-5 w-5 text-base-content/40" />}
            />

            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Loading...
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <div className="text-center">
            <p className="text-base-content/60">
              Don&apos;t have an account?{" "}
              <Link to="/signup" className="link link-primary">
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>

      <AuthImagePattern
        title={"Welcome back!"}
        subtitle={
          "Sign in to continue your conversations and catch up with your messages."
        }
      />
    </div>
  );
};
export default LoginPage;
