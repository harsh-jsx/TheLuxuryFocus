
import React, { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useAuth } from '../context/AuthContext' // Assuming AuthContext is in ../context/AuthContext

const Login = () => {
    const containerRef = useRef(null)
    const { googleSignIn } = useAuth()
    const navigate = useNavigate()
    const [error, setError] = useState('')

    useGSAP(() => {
        const tl = gsap.timeline()

        tl.from(containerRef.current, {
            opacity: 0,
            duration: 1,
            ease: 'power3.out'
        })
            .from('.login-title', {
                y: 50,
                opacity: 0,
                duration: 0.8,
                ease: 'power3.out'
            }, '-=0.5')
            .from('.login-btn', {
                y: 20,
                opacity: 0,
                duration: 0.6,
                ease: 'power3.out'
            }, '-=0.4')
            .from('.login-footer', {
                opacity: 0,
                duration: 0.6
            }, '-=0.2')

    }, { scope: containerRef })

    const handleGoogleSignIn = async () => {
        try {
            await googleSignIn()
            navigate('/') // Redirect to dashboard or home
        } catch (error) {
            setError('Failed to sign in with Google.')
            console.error(error)
        }
    }

    return (
        <div ref={containerRef} className="min-h-screen bg-[#0a0a0a] text-[#E4E0D9] flex items-center justify-center px-4 relative overflow-hidden">

            {/* Background Abstract Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-purple-900/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-blue-900/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />

            <div className="w-full max-w-[450px] relative z-10 text-center">
                <div className="mb-12">
                    <h1 className="login-title font-[Albra] text-5xl md:text-6xl mb-4">Welcome Back</h1>
                    <p className="login-title font-[ABC] text-white/50 text-sm tracking-widest uppercase">
                        Sign in to continue your journey
                    </p>
                </div>

                {error && <div className="text-red-500 mb-4 font-[ABC]">{error}</div>}

                <button
                    onClick={handleGoogleSignIn}
                    className="login-btn w-full bg-white text-[#0a0a0a] font-[Albra] text-xl py-4 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-3"
                >
                    <svg className="w-6 h-6" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Continue with Google
                </button>

                <div className="login-footer mt-12 space-y-4">
                    <p className="font-[ABC] text-xs text-white/30 uppercase tracking-widest">
                        By continuing, you agree to our Terms & Conditions
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Login
