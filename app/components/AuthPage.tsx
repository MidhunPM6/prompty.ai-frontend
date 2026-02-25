'use client'

import axios from 'axios'
import React, { useState } from 'react'
import axiosInstance from '../lib/apiInstanse'
import { useAuth } from '../lib/contextAPI'




export const AuthPage= () => {
  const [step, setStep] = useState<'phone' | 'otp'>('phone')
  const [formData, setFormData] = useState<{ mobile: string; otp: string[] }>({
    mobile: '',
    otp: ['', '', '', '']
  })
  console.log(formData)
const {setIsAuthenticated} =useAuth()
  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1 && /^[0-9]?$/.test(value)) {
      const newOtp = [...formData.otp]
      newOtp[index] = value

      setFormData({ ...formData, otp: newOtp })

      // Auto focus next
      if (value && index < 3) {
        document.getElementById(`otp-${index + 1}`)?.focus()
      }
    }
  }
  const sendOtphandler = async () => {
    try {
      const response = await axiosInstance.post('/auth/send-otp', {
        mobile: `+91${formData.mobile}`
      })
      console.log(response.data)
    } catch (error) {
      console.error(error)
    }
  }

  const signupHandler = async () => {
    try {
      const response = await axiosInstance.post('/auth/signup', {
        mobile: formData.mobile
      })
      console.log(response.data)
      setStep('otp')
      sendOtphandler()
    } catch (error) {
      console.error(error)
    }
  }

  const verifyOtpHandler = async () => {
    try {
      const response = await axiosInstance.post('/auth/verify-otp', {
        mobile: formData.mobile,
        userOtp: formData.otp.join('')
      })
      
      console.log(response.data)
      setIsAuthenticated(true)
    } catch (error) {
      // toast.error('Invalid OTP')
      console.error(error)
    }   
  }
  return (
    <div className='min-h-screen flex  items-center justify-center p-6 bg-slate-950'>
      {/* <Toaster expand={true} richColors position="top-right"/> */}
      <div className='w-full max-w-md border-2 border-gray-700 p-10 rounded-[2.5rem] shadow-2xl animate-in fade-in zoom-in duration-500'>
        <div className='text-center mb-10'>
          <div className='w-16 h-16 rounded-3xl bg-zinc-900 dark:bg-white flex items-center justify-center mx-auto mb-6 shadow-xl transform -rotate-6'>
            <span className='text-white dark:text-zinc-900 text-2xl font-black'>
              A
            </span>
          </div>
          <h1 className='text-3xl font-bold text-zinc-900 dark:text-white mb-2 tracking-tight'>
            Welcome back
          </h1>
          <p className='text-zinc-500 dark:text-zinc-400 text-sm'>
            Sign in to continue to Chat AI
          </p>
        </div>

        <div className='space-y-6'>
          {step === 'phone' ? (
            <>
              <div className='space-y-2'>
                <label className='text-xs font-semibold text-zinc-400 uppercase tracking-widest pl-1'>
                  Mobile Number
                </label>
                <input
                  type='tel'
                  value={formData.mobile}
                  placeholder='10-digit mobile number'
                  onChange={e => {
                    const value = e.target.value // allow only digits
                    setFormData({ ...formData, mobile: value })
                  }}
                  className='w-full h-14 bg-white/50 dark:bg-black/20 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-5 focus:ring-2 focus:ring-zinc-500 transition-all outline-none'
                />
              </div>
              <button
                onClick={signupHandler}
                className='w-full h-14 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold rounded-2xl shadow-lg hover:scale-[1.02] active:scale-95 transition-all duration-300'
              >
                Send Code
              </button>
            </>
          ) : (
            <>
              <div className='space-y-4'>
                <label className='text-xs font-semibold text-zinc-400 uppercase tracking-widest block text-center'>
                  Verification Code
                </label>
                <div className='flex justify-between gap-3 px-4'>
                  {formData.otp.map((digit, idx) => (
                    <input
                      key={idx}
                      id={`otp-${idx}`}
                      type='text'
                      maxLength={1}
                      value={digit}
                      onChange={e => handleOtpChange(idx, e.target.value)}
                      className='w-14 h-16 text-center text-2xl font-bold bg-white/50 dark:bg-black/20 border border-zinc-200 dark:border-zinc-800 rounded-2xl focus:ring-2 focus:ring-zinc-500 outline-none transition-all'
                    />
                  ))}
                </div>
              </div>
              <button
                onClick={verifyOtpHandler}
                className='w-full h-14 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold rounded-2xl shadow-lg hover:scale-[1.02] active:scale-95 transition-all duration-300'
              >
                Verify & Start
              </button>
              <p className='text-center text-xs text-zinc-500'>
                Didn't get the code?{' '}
                <button
                  onClick={() => setStep('phone')}
                  className='font-bold underline text-zinc-800 dark:text-zinc-200'
                >
                  Resend
                </button>
              </p>
            </>
          )}

          <div className='relative py-4'>
            <div className='absolute inset-0 flex items-center'>
             
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
