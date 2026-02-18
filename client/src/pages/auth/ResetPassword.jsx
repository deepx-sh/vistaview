import { useState,useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useVerifyPasswordResetOTPMutation, useResetPasswordMutation, useSendPasswordResetOTPMutation, } from "../../features/auth/authApi";
import OtpInput from "../../components/ui/OtpInput";
import PasswordStrength from "../../components/ui/PasswordStrength";

import React from 'react'


const ResetPassword = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const email = location.state?.email || "";

    const [otp, setOtp] = useState("");
    const [resetToken, setResetToken] = useState(null);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
     const [timer, setTimer] = useState(30);
    const [isVerifying, setIsVerifying] = useState(false);
    const [verifyOtp] = useVerifyPasswordResetOTPMutation();
    const [resetPassword, { isLoading }] = useResetPasswordMutation();
    const [sendOtp] = useSendPasswordResetOTPMutation();

     useEffect(() => {
            if (timer === 0) return;
            const interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            },1000)
    
            return () => clearInterval(interval);
        }, [timer])
        
    const handleVerifyOtp = async () => {
          setIsVerifying(true);
        try {
          
            const res = await verifyOtp({ email, otp }).unwrap();
            setResetToken(res.data.resetToken);
            toast.success("OTP verified. Set new password")
        } catch (error) {
            if (error?.data?.errors.length > 0) {
                    error.data.errors.map((e)=> toast.error(e))
            } else {
                toast.error("Invalid OTP")
                }
        } finally {
            setIsVerifying(false);
        }
    }

    const handleResetPassword = async () => {
        try {
            await resetPassword({ resetToken, newPassword: password, confirmPassword }).unwrap();
            toast.success("Password reset successful");
            navigate("/login")
        } catch (error) {
           
            if (error?.data?.errors.length > 0) {
                    error.data.errors.map((e)=> toast.error(e))
            } else {
                toast.error("Password do not match")
                }
        }
    }
      const handleResend = async () => {
        try {
            await sendOtp({email}).unwrap();
            toast.success("Reset password OTP sent to your email")
            setTimer(30)
        } catch (error) {
            toast.error(error?.data?.message || "Something went wrong")
        }
    }
    
  return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4 py-10">
          <div className="w-full max-w-md bg-surface border border-border rounded-xl shadow-md p-8">
              
              {!resetToken ? (
                  <>
                      <h1 className="text-2xl font-semibold text-center mb-6">
                            Enter Reset Code    
                      </h1>  
                       <p className='text-text-secondary text-sm mb-6 text-center'>
                  Enter the 6-digit reset code sent to <br />
                  <span className='font-medium'>{email}</span>
                      </p>
                      
                      <OtpInput value={otp} onChange={setOtp} />
                      
                      <button onClick={handleVerifyOtp} className="w-full mt-6 bg-primary hover:bg-primary-hover text-white py-2 rounded-md transition-colors duration-200">
                          {isVerifying ? "Verifying...":"Verify Code"}
                      </button>

                       <div className='mt-6 text-sm text-text-secondary text-center'>
                  Didn't receive the reset code?{" "}
                  {timer > 0 ? (
                      <span className='text-text-muted cursor-not-allowed'>Resend in {timer}s</span>
                  ) : (
                          <button onClick={handleResend} className='text-primary hover:underline font-medium cursor-pointer'>Resend OTP</button>
                  )}
              </div>
                  </>  
              ) : (
                      <>
                          <h2 className="text-2xl font-semibold text-center mb-6">
                              Set New Password
                          </h2>

                          <input type="password"
                              placeholder="Password"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                          />

                          {password && <PasswordStrength password={password} />}
                          
                          <input type="password"
                              placeholder="Confirm Password"
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              className="w-full px-4 py-2 border border-border rounded-md mt-4 focus:ring-2 focus:outline-none focus:ring-primary"
                          />

                          <button onClick={handleResetPassword} disabled={isLoading} className="w-full mt-6 bg-primary hover:bg-primary-hover text-white py-2 rounded-md">
                              {isLoading ? "Resetting...":"Reset Password"}
                          </button>
                      </>
              )}
          </div>
    </div>
  )
}

export default ResetPassword
