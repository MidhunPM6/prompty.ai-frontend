"use client";

import React, { useState } from "react";

interface AuthPageProps {
    onLogin: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onLogin }) => {
    const [step, setStep] = useState<"phone" | "otp">("phone");
    const [otp, setOtp] = useState(["", "", "", ""]);


    console.log(otp );
    

    const handleOtpChange = (index: number, value: string) => {
        if (value.length <= 1) {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);
            // Auto-focus next input
            if (value && index < 3) {
                const nextInput = document.getElementById(`otp-${index + 1}`);
                nextInput?.focus();
            }
        }
    };

    const verifyOtp = () => {
        if (otp.every((digit) => digit !== "")) {
            onLogin();
        }
    };

    return (
        <div className="min-h-screen flex  items-center justify-center p-6 bg-slate-950">
            <div className="w-full max-w-md border-2 border-gray-700 p-10 rounded-[2.5rem] shadow-2xl animate-in fade-in zoom-in duration-500">
                <div className="text-center mb-10">
                    <div className="w-16 h-16 rounded-3xl bg-zinc-900 dark:bg-white flex items-center justify-center mx-auto mb-6 shadow-xl transform -rotate-6">
                        <span className="text-white dark:text-zinc-900 text-2xl font-black">
                            A
                        </span>
                    </div>
                    <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2 tracking-tight">
                        Welcome back
                    </h1>
                    <p className="text-zinc-500 dark:text-zinc-400 text-sm">
                        Sign in to continue to Chat AI
                    </p>
                </div>

                <div className="space-y-6">
                    {step === "phone" ? (
                        <>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-widest pl-1">
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    placeholder="+1 (555) 000-0000"
                                    className="w-full h-14 bg-white/50 dark:bg-black/20 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-5 focus:ring-2 focus:ring-zinc-500 transition-all outline-none"
                                />
                            </div>
                            <button
                                onClick={() => setStep("otp")}
                                className="w-full h-14 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold rounded-2xl shadow-lg hover:scale-[1.02] active:scale-95 transition-all duration-300"
                            >
                                Send Code
                            </button>
                        </>
                    ) : (
                        <>
                            <div className="space-y-4">
                                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-widest block text-center">
                                    Verification Code
                                </label>
                                <div className="flex justify-between gap-3 px-4">
                                    {otp.map((digit, idx) => (
                                        <input
                                            key={idx}
                                            id={`otp-${idx}`}
                                            type="text"
                                            maxLength={1}
                                            value={digit}
                                            onChange={(e) => handleOtpChange(idx, e.target.value)}
                                            className="w-14 h-16 text-center text-2xl font-bold bg-white/50 dark:bg-black/20 border border-zinc-200 dark:border-zinc-800 rounded-2xl focus:ring-2 focus:ring-zinc-500 outline-none transition-all"
                                        />
                                    ))}
                                </div>
                            </div>
                            <button
                                onClick={verifyOtp}
                                className="w-full h-14 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold rounded-2xl shadow-lg hover:scale-[1.02] active:scale-95 transition-all duration-300"
                            >
                                Verify & Start
                            </button>
                            <p className="text-center text-xs text-zinc-500">
                                Didn't get the code?{" "}
                                <button
                                    onClick={() => setStep("phone")}
                                    className="font-bold underline text-zinc-800 dark:text-zinc-200"
                                >
                                    Resend
                                </button>
                            </p>
                        </>
                    )}

                    <div className="relative py-4">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-zinc-200 dark:border-zinc-800"></span>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white/0 px-2 text-zinc-400 font-medium">
                                Or
                            </span>
                        </div>
                    </div>

                    <button className="w-full h-14 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center gap-3 rounded-2xl shadow-sm hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all duration-300">
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path
                                fill="#4285F4"
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                                fill="#34A853"
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                                fill="#FBBC05"
                                d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z"
                            />
                            <path
                                fill="#EA4335"
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                            />
                        </svg>
                        <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                            Continue with Google
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
};
