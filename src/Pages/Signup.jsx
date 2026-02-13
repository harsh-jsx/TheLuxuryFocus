import React, { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

const Signup = () => {
    const containerRef = useRef(null)
    const formRef = useRef(null)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    })

    useGSAP(() => {
        const tl = gsap.timeline()

        tl.from(containerRef.current, {
            opacity: 0,
            duration: 1,
            ease: 'power3.out'
        })
            .from('.signup-title', {
                y: 50,
                opacity: 0,
                duration: 0.8,
                ease: 'power3.out'
            }, '-=0.5')
            .from('.signup-input-group', {
                y: 30,
                opacity: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: 'power3.out'
            }, '-=0.4')
            .from('.signup-btn', {
                y: 20,
                opacity: 0,
                duration: 0.6,
                ease: 'power3.out'
            }, '-=0.4')
            .from('.signup-footer', {
                opacity: 0,
                duration: 0.6
            }, '-=0.2')

    }, { scope: containerRef })

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        // Handle signup logic here
        console.log('Signup:', formData)
    }

    return (
        <div ref={containerRef} className="min-h-screen bg-[#0a0a0a] text-[#E4E0D9] flex items-center justify-center px-4 relative overflow-hidden">

            {/* Background Abstract Elements */}
            <div className="absolute bottom-[-10%] left-[-10%] w-[45vw] h-[45vw] bg-purple-900/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />
            <div className="absolute top-[-10%] right-[-10%] w-[45vw] h-[45vw] bg-blue-900/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />

            <div className="w-full max-w-[450px] relative z-10 py-10">
                <div className="mb-10 text-center">
                    <h1 className="signup-title font-[Albra] text-5xl md:text-6xl mb-4">Create Account</h1>
                    <p className="signup-title font-[ABC] text-white/50 text-sm tracking-widest uppercase">
                        Join The Luxury Focus today
                    </p>
                </div>

                <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
                    <div className="signup-input-group space-y-2">
                        <label className="font-[ABC] text-xs uppercase tracking-widest text-white/70 ml-1">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-4 font-[ABC] text-white placeholder-white/20 focus:outline-none focus:border-white/30 transition-colors"
                            placeholder="Enter your full name"
                        />
                    </div>

                    <div className="signup-input-group space-y-2">
                        <label className="font-[ABC] text-xs uppercase tracking-widest text-white/70 ml-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-4 font-[ABC] text-white placeholder-white/20 focus:outline-none focus:border-white/30 transition-colors"
                            placeholder="Enter your email"
                        />
                    </div>

                    <div className="signup-input-group space-y-2">
                        <label className="font-[ABC] text-xs uppercase tracking-widest text-white/70 ml-1">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-4 font-[ABC] text-white placeholder-white/20 focus:outline-none focus:border-white/30 transition-colors"
                            placeholder="Create a password"
                        />
                    </div>

                    <div className="signup-input-group space-y-2">
                        <label className="font-[ABC] text-xs uppercase tracking-widest text-white/70 ml-1">Confirm Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-4 font-[ABC] text-white placeholder-white/20 focus:outline-none focus:border-white/30 transition-colors"
                            placeholder="Confirm your password"
                        />
                    </div>

                    <button
                        type="submit"
                        className="signup-btn w-full bg-[#E4E0D9] text-[#0a0a0a] font-[Albra] text-xl py-4 rounded-lg hover:bg-white transition-colors mt-6"
                    >
                        Create Account
                    </button>
                </form>

                <div className="signup-footer mt-8 text-center">
                    <p className="font-[ABC] text-sm text-white/40">
                        Already have an account?{' '}
                        <Link to="/login" className="text-white hover:underline decoration-1 underline-offset-4">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Signup
