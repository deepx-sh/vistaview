import React from 'react'
import {  z } from 'zod';
import { useSendPasswordResetOTPMutation } from '../../features/auth/authApi';
import { Link, useNavigate } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';


const schema = z.object({
    email:z.string().email("Enter valid email")
})

const ForgotPassword = () => {

    const navigate = useNavigate();
    const [sendOtp, { isLoading }] = useSendPasswordResetOTPMutation();

    const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) })
    
    const onSubmit = async (data) => {
        try {
            await sendOtp(data).unwrap();
            toast.success("OTP sent to your email")
            navigate("/reset-password",{state:{email:data.email}})
        } catch (error) {
            toast.error(error?.data?.message || "Something went wrong")
        }
    }
  return (
      <div className='min-h-screen flex items-center justify-center bg-background px-4 py-10'>
          <div className='w-full max-w-md bg-surface border border-border rounded-xl shadow-md p-8'>
              <h2 className='text-2xl font-semibold text-center mb-2'>
                  Forgot Password
              </h2>

              <p className='text-text-secondary text-center text-sm mb-6'>
                  Enter your email to receive a reset code
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
                  <input type="text"
                      placeholder='Email'
                      {...register("email")}
                      className='w-full px-4 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary'
                  />

                  {errors.email && (
                      <p className='text-danger text-sm'>
                          {errors.email.message}
                      </p>
                  )}


                  <button type='submit' disabled={isLoading} className='w-full bg-primary hover:bg-primary-hover text-white py-2 rounded-md transition-colors duration-200'>
                      {isLoading ?"Sending...":"Send Reset Code"}
                  </button>
              </form>

              <div className='mt-6 text-center text-sm'>
                  <Link to="/login" className='text-primary hover:underline'>Back to login</Link>
              </div>
          </div>
    </div>
  )
}

export default ForgotPassword