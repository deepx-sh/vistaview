import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLoginMutation, authApi } from '../../features/auth/authApi';
import { useDispatch } from 'react-redux';
import { setUser } from '../../features/auth/authSlice';
import { useNavigate,Link } from 'react-router-dom';
import toast from "react-hot-toast";
import React from 'react'


const schema = z.object({
    email: z.string().email("Invalid email"),
    password:z.string().min(8,"Password must be at least 8 characters")
});


const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [login, { isLoading }] = useLoginMutation();

    const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) });

    const onSubmit = async (data) => {
        try {
             await login(data).unwrap();

            const res = await dispatch(
                authApi.endpoints.getMe.initiate()
            ).unwrap();
           
            dispatch(setUser(res.data.user));

            toast.success("Login successful")

            if (res.data.user.role === "admin") {
                navigate("/admin/dashboard")
            } else if (res.data.user.role === "owner") {
                navigate("/owner/dashboard")
            } else {
                navigate("/")
            }
        } catch (error) {
            toast.error(error?.data?.message || "Login failed")
        }
    }
  return (
      <div className='min-h-screen bg-background flex'>
          {/* Left Side Hidden on small screen */}
          <div className='hidden lg:flex flex-1 items-center justify-center bg-primary text-white p-12'>
              <div className='max-w-md'>
                  <h1 className='text-4xl font-bold mb-4'>
                      Discover & Review Beautiful Places
                  </h1>

                  <p className='text-white/80'>
                  Join VistaView and explore trusted tourism destinations leave reviews, and connect with verified owners</p>
              </div>
          </div>

          {/* Right Side Login Form */}

          <div className='flex flex-1 items-center justify-center px-6 py-12'>
              <div className='w-full max-w-md bg-surface p-8 rounded-xl shadow-md border border-border'>
                  
                  <h2 className='text-2xl font-semibold text-center mb-2'>
                      Welcome Back
                  </h2>

                  <p className='text-text-secondary font-semibold text-center mb-6 text-sm'>
                      Login to continue your journey
                  </p>


                  <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
                      
                      {/* Email */}
                      <div>
                          <input type="text"
                              placeholder='Email'
                              {...register("email")}
                              className='w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary'
                          />

                          {errors.email && (
                              <p className='text-danger text-sm mt-1'>
                                  {errors.email.message}
                              </p>
                          )}
                      </div>


                      {/* Password */}
                      <div>
                          <input type="password"
                              placeholder='Password'
                              {...register("password")}
                              className='w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary'
                          />

                          {errors.password && (
                              <p className='text-danger text-sm mt-1'>
                                  {errors.password.message}
                              </p>
                          )}
                      </div>

                      {/* Forgot Password */}
                      <div className='text-right'>
                          <Link to="/forgot-password" className='text-sm text-primary hover:underline'>
                            Forgot password?
                          </Link>
                      </div>

                      {/* Login Button */}
                      <button type='submit' disabled={isLoading} className={`w-full bg-primary hover:bg-primary-hover text-white py-2 rounded-md cursor-${isLoading ? "progress" : "pointer"} transition duration-200`}>
                          {isLoading ? "Logging in...":"Login"}
                      </button>
                  </form>

                  {/* Divider */}
                  <div className='my-6 border-t border-border'></div>


                  {/* Signup Link */}
                  <p className='text-center text-sm text-text-secondary'>
                      Don't have an account?{" "}
                      <Link to="/register" className='text-primary font-medium hover:underline'>Sign up</Link>
                  </p>
              </div>
          </div>
        </div>
  )
}

export default Login