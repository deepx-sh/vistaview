import React,{useState} from 'react'
import { useForm } from 'react-hook-form'
import { Eye, EyeOff, KeyRound } from 'lucide-react'
import { useChangePasswordMutation } from '../../features/user/userApi'
import PasswordStrength from './PasswordStrength';
import handleApiError from '../../utils/handleApiError';
import toast from 'react-hot-toast';

const PasswordInput = ({ label, name, register, rules, error, watch }) => {
    const [show, setShow] = useState(false);

    return (
        <div>
            <label className='block text-sm font-medium text-text-secondary mb-1.5'>
                {label}
            </label>

            <div className='relative'>
                <input type={show ? 'text' : 'password'}
                    {...register(name, rules)}
                    className={`w-full border rounded-md px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary ${error ? "border-danger":"border-border"}`}
                />

                <button type='button' onClick={() => setShow((s) => !s)}
                    className='absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary'
                    tabIndex={-1}
                >{show ? <EyeOff size={15}/>: <Eye size={15}/>}</button>
            </div>
            {error && <p className='text-danger text-xs mt-1'>{error.message}</p>}
        </div>
    )
}

const PASSWORD_REGEX=/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()]).{8,32}$/;
const ChangePasswordForm = () => {
    const [changePassword, { isLoading }] = useChangePasswordMutation();

    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState:{errors}
    } = useForm()
    
    const newPassword = watch('newPassword', '')
    const onSubmit = async (data) => {
        try {
            const res = await changePassword(data).unwrap()
            toast.success(res.message || 'Password changed successfully')
            reset();
        } catch (error) {
            handleApiError(error,"Failed to change password")
        }
    }
  return (
      <div className='bg-surface border border-border rounded-lg p-6'>
          <div className='flex items-center gap-2 mb-5'>
              <KeyRound size={18} className='text-primary' />
              <h2 className='font-semibold'>Change Password</h2>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
              <PasswordInput
                  label="Current Password"
                  name="currentPassword"
                  register={register}
                  error={errors.currentPassword}
                  rules={{required:'Current password is required'}}
              />

              <PasswordInput
                  label="New Password"
                  name="newPassword"
                  register={register}
                  error={errors.newPassword}
                  rules={{
                      required: 'New password is required',
                      pattern: {
                          value: PASSWORD_REGEX,
                          message:'Password requires uppercase, lowercase, number and special character (8–32 chars)'
                      }
                  }}
              />

              {newPassword.length > 0 && (
                  <PasswordStrength password={newPassword}/>
              )}
              
              <PasswordInput
                  label="Confirm New Password"
                  name="confirmPassword"
                  register={register}
                  error={errors.currentPassword}
                  rules={{
                      required: 'Please confirm your new password',
                      validate:(v)=> v===newPassword || 'Password do not match'
                  }}
              />

              <button type='submit' disabled={isLoading} className='bg-primary hover:bg-primary-hover text-white px-6 py-2 rounded-md text-sm transition duration-200 disabled:opacity-60'>{isLoading?"Changing...":"Change Password"}</button>
          </form>
    </div>
  )
}

export default ChangePasswordForm