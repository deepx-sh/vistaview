import React from 'react'
import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useVerifyEmailMutation, useResendVerifyOTPMutation } from '../../features/auth/authApi'
import OtpInput from '../../components/ui/OtpInput'
import toast from 'react-hot-toast'


const VerifyEmail = () => {

    const location = useLocation();
    const navigate = useNavigate();
    const email = location.state?.email || "";

    const [otp, setOtp] = useState("");
    const [timer, setTimer] = useState(30);

    const [verifyEmail, { isLoading }] = useVerifyEmailMutation();
    const [resendOtp] = useResendVerifyOTPMutation();

    useEffect(() => {
        if (timer === 0) return;
        const interval = setInterval(() => {
            setTimer((prev) => prev - 1);
        },1000)

        return () => clearInterval(interval);
    }, [timer])
    

    const handleVerify = async () => {
        if (otp.length !== 6) {
            toast.error("Enter complete OTP")
        }

        try {
            await verifyEmail({ email, otp }).unwrap();
            toast.success("Email verified successfully")
            navigate("/login")
        } catch (error) {
            console.log(error);
            
            toast.error(error?.data?.message || "Verification failed")
        }
    }

    const handleResend = async () => {
        try {
            await resendOtp({ email }).unwrap();
            toast.success("New OTP sent!")
            setTimer(30)
        } catch (error) {
            toast.error(error?.data?.message || "Failed to resend OTP")
        }
    }
  return (
      <div className='min-h-screen flex items-center justify-center bg-background px-4 py-10'>
          <div className='w-full max-w-md bg-surface border border-border rounded-xl shadow-md p-8 text-center'>
              <h2 className='text-2xl font-semibold mb-2'>Verify Your Email</h2>
              <p className='text-text-secondary text-sm mb-6'>
                  Enter the 6-digit code sent to <br />
                  <span className='font-medium'>{ email}</span>
              </p>

              <OtpInput value={otp} onChange={setOtp} />
              
              <button onClick={handleVerify} disabled={isLoading} className='w-full mt-6 bg-primary hover:bg-primary-hover text-white py-2 rounded-md transition duration-200'>
                  {isLoading ? "Verifying...":"Verify Email"}
              </button>

              <div className='mt-6 text-sm text-text-secondary'>
                  Didn't receive the code?{" "}
                  {timer > 0 ? (
                      <span className='text-text-muted'>Resend in {timer}s</span>
                  ) : (
                          <button onClick={handleResend} className='text-primary hover:underline font-medium'>Resend OTP</button>
                  )}
              </div>
          </div>
    </div>
  )
}

export default VerifyEmail