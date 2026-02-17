import zxcvbn from 'zxcvbn';
import { Check, X } from 'lucide-react';
import React from 'react'


const PasswordStrength = ({ password }) => {
    const result = zxcvbn(password || "");
    const score = result.score;

    const getColor = () => {
        if (score <= 1) return 'bg-danger';
        if (score === 2) return 'bg-warning';
        return 'bg-success'
    }

    const check = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
        special:/[^A-Za-z0-9]/.test(password)
    }
  return (
      <div className='space-y-3 mt-2'>
          <div className='h-2 bg-border rounded-md overflow-hidden'>
              <div className={`h-full ${getColor()} transition-all duration-300`} style={{width:`${(score+1)*20}%`}}></div>
          </div>

          <ul className='space-y-1 text-sm'>
              {Object.entries(check).map(([key, passed]) => (
                  <li key={key} className={`flex items-center gap-2 ${passed ? "text-success" : "text-text-muted"}`}>
                      {passed ? <Check size={16} /> : <X size={16} />}
                      {key==="length" && "At least 8 characters"}
                      {key==="uppercase" && "One uppercase letter"}
                      {key==="lowercase" && "One lowercase letter"}
                      {key==="number" && "One number"}
                      {key==="special" && "One special character"}
                  </li>
              ))}
          </ul>
    </div>
  )
}

export default PasswordStrength