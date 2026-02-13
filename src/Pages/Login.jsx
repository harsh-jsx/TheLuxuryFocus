import React, { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

const Login = () => {
    const containerRef = useRef(null)
    const formRef = useRef(null)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

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
            .from('.login-input-group', {
                y: 30,
                opacity: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: 'power3.out'
            }, '-=0.4')
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

    const handleSubmit = (e) => {
        e.preventDefault()
        // Handle login logic here
        console.log('Login:', { email, password })
    }

    return (
        <div ref={containerRef} className="min-h-screen bg-[#0a0a0a] text-[#E4E0D9] flex items-center justify-center px-4 relative overflow-hidden">

            {/* Background Abstract Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-purple-900/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-blue-900/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />

            <div className="w-full max-w-[450px] relative z-10">
                <div className="mb-12 text-center">
                    <h1 className="login-title font-[Albra] text-5xl md:text-6xl mb-4">Welcome Back</h1>
                    <p className="login-title font-[ABC] text-white/50 text-sm tracking-widest uppercase">
                        Sign in to continue your journey
                    </p>
                </div>

                <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                    <div className="login-input-group space-y-2">
                        <label className="font-[ABC] text-xs uppercase tracking-widest text-white/70 ml-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-4 font-[ABC] text-white placeholder-white/20 focus:outline-none focus:border-white/30 transition-colors"
                            placeholder="Enter your email"
                        />
                    </div>

                    <div className="login-input-group space-y-2">
                        <label className="font-[ABC] text-xs uppercase tracking-widest text-white/70 ml-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-4 font-[ABC] text-white placeholder-white/20 focus:outline-none focus:border-white/30 transition-colors"
                            placeholder="Enter your password"
                        />
                    </div>

                    <div className="login-input-group flex justify-end">
                        <Link to="/forgot-password" className="font-[ABC] text-xs text-white/50 hover:text-white transition-colors">
                            Forgot Password?
                        </Link>
                    </div>

                    <button
                        type="submit"
                        className="login-btn w-full bg-[#E4E0D9] text-[#0a0a0a] font-[Albra] text-xl py-4 rounded-lg hover:bg-white transition-colors mt-8"
                    >
                        Sign In
                    </button>
                </form>

                <div className="login-footer mt-12 text-center space-y-4">
                    <p className="font-[ABC] text-sm text-white/40">
                        Don't have an account?{' '}
                        <Link to="/signup" className="text-white hover:underline decoration-1 underline-offset-4">
                            Sign Up
                        </Link>
                    </p>
                    <div className="flex items-center justify-center gap-4 pt-4 border-t border-white/5 w-full">
                        <button className="p-2 rounded-full border border-white/10 hover:bg-white/5 transition-colors group">
                            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white/60 group-hover:fill-white transition-colors" xmlns="http://www.w3.org/2000/svg"><path d="M12.001 2C6.478 2 2.002 6.478 2.002 12c0 4.991 3.658 9.127 8.437 9.879v-6.988h-2.54v-2.891h2.54V9.798c0-2.508 1.493-3.891 3.776-3.891 1.094 0 2.24.195 2.24.195v2.459h-1.264c-1.242 0-1.628.772-1.628 1.563v1.875h2.771l-.443 2.891h-2.328v6.988C18.344 21.129 22 16.992 22 12c0-5.522-4.477-10-9.999-10z" /></svg>
                        </button>
                        <button className="p-2 rounded-full border border-white/10 hover:bg-white/5 transition-colors group">
                            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white/60 group-hover:fill-white transition-colors" xmlns="http://www.w3.org/2000/svg"><path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z" /></svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login
