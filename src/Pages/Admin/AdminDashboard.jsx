import React, { useState, useEffect } from 'react'
import { blogService } from '../../services/blogService'
import { FileText, Users, Eye, TrendingUp, Calendar, ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalBlogs: 0,
        totalUsers: 0, // Mocked for now
        totalViews: '12.4K', // Mocked for now
        growth: '+14%' // Mocked for now
    })

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const blogs = await blogService.getAllBlogs()
                setStats(prev => ({ ...prev, totalBlogs: blogs.length }))
            } catch (error) {
                console.error("Error fetching stats", error)
            }
        }
        fetchStats()
    }, [])

    const statCards = [
        { name: 'Total Articles', value: stats.totalBlogs, icon: <FileText className="text-blue-600" />, trend: '+3 this week' },
        { name: 'Active Users', value: '2,450', icon: <Users className="text-purple-600" />, trend: stats.growth },
        { name: 'Total Views', value: stats.totalViews, icon: <Eye className="text-green-600" />, trend: '+20.1%' },
        { name: 'Engagement', value: '64%', icon: <TrendingUp className="text-orange-600" />, trend: '+2.4%' },
    ]

    return (
        <div className="max-w-7xl mx-auto">
            <header className="mb-10">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
                <p className="text-gray-500 mt-1">Snapshot of your ecosystem's performance.</p>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {statCards.map((stat) => (
                    <div key={stat.name} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-gray-50 rounded-xl">
                                {stat.icon}
                            </div>
                            <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                                {stat.trend}
                            </span>
                        </div>
                        <p className="text-sm font-medium text-gray-400 uppercase tracking-widest mb-1">{stat.name}</p>
                        <h3 className="text-3xl font-bold text-gray-900">{stat.value}</h3>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Activity Mock */}
                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-bold text-gray-900">Recent Articles</h3>
                        <Link to="/admin/blogs" className="text-sm font-bold text-gray-400 hover:text-black transition-colors flex items-center gap-1 uppercase tracking-widest">
                            View All <ArrowUpRight size={16} />
                        </Link>
                    </div>
                    <div className="space-y-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center gap-4 group cursor-pointer">
                                <div className="w-16 h-12 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                                    <div className="w-full h-full bg-gray-200 animate-pulse" />
                                </div>
                                <div className="grow">
                                    <p className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">Luxury Living: A New Design Perspective</p>
                                    <div className="flex items-center gap-4 mt-1 text-xs text-gray-400">
                                        <span className="flex items-center gap-1"><Calendar size={12} /> Oct {10 + i}, 2025</span>
                                        <span className="bg-gray-50 px-2 py-0.5 rounded">Real Estate</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-black text-white p-8 rounded-3xl flex flex-col justify-between relative overflow-hidden">
                    <div className="relative z-10">
                        <h3 className="text-2xl font-bold mb-4 tracking-tight">Ready to publish?</h3>
                        <p className="text-white/60 mb-8 max-w-xs">Creation is at the heart of TLF. Share your latest project or insight with the world.</p>
                        <Link
                            to="/admin/blogs"
                            className="inline-flex items-center gap-2 bg-white text-black px-8 py-3 rounded-xl font-bold hover:bg-gray-100 transition-all uppercase tracking-widest text-xs"
                        >
                            <Plus size={16} /> New Article
                        </Link>
                    </div>

                    {/* Abstract Decorative Element */}
                    <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
                </div>
            </div>
        </div>
    )
}

const Plus = ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
)

export default AdminDashboard
