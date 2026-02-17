import { useForm } from "react-hook-form";
import {  z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { useRegisterMutation } from "../../features/auth/authApi";
import { useNavigate, Link } from "react-router-dom";
import PasswordStrength from "../../components/ui/PasswordStrength";
import toast from "react-hot-toast";
import { useState } from "react";
import React from 'react'

const schema = z.object({
    name: z.string().min(2, "Name is required"),
    email: z.string().email("Enter a valid email"),
    password: z.string().min(8, "Password must be at least 8 character"),
})
const Register = () => {
    const navigate = useNavigate();
    const [registerUser, { isLoading }] = useRegisterMutation();
    const [passwordValue, setPasswordValue] = useState("");

    const {
        register,
        handleSubmit,
        watch,
        formState:{errors}
    } = useForm({
        resolver:zodResolver(schema)
    })

    const onSubmit = async (data) => {
        try {
            await registerUser(data).unwrap();
            toast.success("OTP send to your email");
            navigate("/verify-email",{state:{email:data.email}})
        } catch (error) {
            console.log(error);
            
            toast.error(error?.data?.message || "Registration failed")
        }
    }
  return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4 py-10">
          <div className="w-full max-w-md bg-surface border border-border rounded-xl shadow-md p-8">
              <h2 className="text-2xl font-semibold text-center mb-2">
                  Create Account
              </h2>

              <p className="text-text-secondary text-center text-sm mb-6">
                  Join VistaView today
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  {/* Name */}

                  <div>
                      <input type="text"
                          placeholder="Full Name"
                          {...register("name")}
                          className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      {errors.name && (
                          <p className="text-danger text-sm mt-1">
                              {errors.name.message}
                          </p>
                      )}
                  </div>


                  {/* Email */}
                  <div>
                      <input type="email"
                          placeholder="Email"
                          {...register("email")}
                          className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      />

                      {errors.email && (
                          <p className="text-danger text-sm mt-1">
                              {errors.email.message}
                          </p>
                      )}
                  </div>

                  {/* Password */}
                  <div>
                      <input type="password"
                          placeholder="Password"
                          {...register("password")}
                          onChange={(e) => setPasswordValue(e.target.value)}
                          className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      />

                      {errors.password && (
                          <p className="text-danger text-sm mt-1">
                              {errors.password.message}
                          </p>
                      )}
                  </div>

                  {passwordValue && (
                      <PasswordStrength password={passwordValue}/>
                  )}

                  <button type="submit" disabled={isLoading} className="w-full bg-primary hover:bg-primary-hover text-white py-2 rounded-md cursor-pointer transition duration-200">
                      {isLoading ? "Creating account..." :"Sign Up"}
                  </button>
              </form>

              <div className="mt-6 border-t border-border pt-4 text-center text-sm">
                  Already have an account{" "}
                  <Link to="/login" className="text-primary font-medium hover:underline">Login</Link>
              </div>
          </div>
    </div>
  )
}

export default Register