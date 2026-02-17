import { useRef } from "react";

import React from 'react'

const OtpInput = ({ length = 6, value, onChange }) => {
    
    const inputRef = useRef([]);

    const handleChange = (e, index) => {
        const digit = e.target.value.replace(/\D/g, "");
        if (!digit) return;

        const newOtp = value.split("");
        newOtp[index] = digit;
        onChange(newOtp.join(""));

        if (index < length - 1) {
            inputRef.current[index + 1].focus();
        }
    }

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace") {
            const newOtp = value.split("");
            newOtp[index] = "";
            onChange(newOtp.join(""))

            if (index > 0) {
                inputRef.current[index - 1].focus();
            }
        }
    }

    const handlePaste = (e) => {
        const paste = e.clipboardData.getData("text").slice(0, length);
        if (!/^\d+$/.test(paste)) return
        
        onChange(paste.padEnd(length, ""));
    }
  return (
      <div className="flex justify-center gap-2" onPaste={handlePaste}>
          {Array.from({ length }).map((_, index)=>(
          <input type="text" key={index} maxLength={1} value={value[index] || ""} onChange={(e) => handleChange(e, index)} onKeyDown={(e) => handleKeyDown(e, index)} ref={(el) => (inputRef.current[index] = el)}
            className="w-10 h-12 text-center font-semibold text-lg border border-border rounded-md focus:ring-2 focus:ring-primary focus:outline-none"
          />
          ))}
    </div>
  )
}

export default OtpInput