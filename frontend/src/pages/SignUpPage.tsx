// import { useState } from "react";
// import { useAuthStore } from "../store/useAuthStore";
import {
  // Loader2,
  Lock,
  Mail,
  User,
} from "lucide-react";
import { Link } from "react-router";

import AuthImagePattern from "../ui/AuthImagePatter";
import FormField from "../components/FormField";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import AuthLogo from "../ui/AuthLogo";
// import toast from "react-hot-toast";

const SignUpPage = () => {
  type FormData = {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
  };

  const schema = z
    .object({
      fullName: z.string().min(2, { message: "Name is too short" }),
      email: z.string().email(),
      password: z
        .string()
        .min(6, { message: "Password is too short" })
        .max(20, { message: "Password is too long" }),

      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"], // path of error
    });

  //   const { signup, isSigningUp } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    console.log(data);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          <AuthLogo
            title="Create Account"
            subtitle="Get started with your free account"
          />

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              label="Full Name"
              type="text"
              name="fullName"
              placeholder="John Doe"
              register={register}
              error={errors.fullName}
              icon={<User className="size-5 text-base-content/40" />}
            />

            <FormField
              label="Email"
              type="email"
              name="email"
              placeholder="You@example.com"
              register={register}
              error={errors.email}
              icon={<Mail className="size-5 text-base-content/40" />}
            />

            <FormField
              label="Password"
              type="password"
              name="password"
              placeholder="Password"
              register={register}
              error={errors.password}
              icon={<Lock className="size-5 text-base-content/40" />}
            />

            <FormField
              label="Confirm Password"
              type="password"
              placeholder="Confirm Password"
              name="confirmPassword"
              register={register}
              error={errors.confirmPassword}
              icon={<Lock className="size-5 text-base-content/40" />}
            />

            <button
              type="submit"
              className="btn btn-primary w-full"
              // disabled={isSigningUp}
            >
              {/* {isSigningUp ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  Loading...
                </>
              ) : (
                "Create Account"
              )} */}
              Create Account
            </button>
          </form>

          <div className="text-center">
            <p className="text-base-content/60">
              Already have an account?{" "}
              <Link to="/login" className="link link-primary">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* right side */}

      <AuthImagePattern
        title="Join our community"
        subtitle="Connect with friends, share moments, and stay in touch with your loved ones."
      />
    </div>
  );
};
export default SignUpPage;
