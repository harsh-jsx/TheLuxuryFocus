import React, { useState } from 'react'
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { LayoutDashboard, FileText, Settings, LogOut, Menu, X, ChevronRight, Users, ShoppingBag, CreditCard, Images, ClipboardList } from 'lucide-react'

const AdminLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)
    const { logout, userData, isAdmin } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    if (!isAdmin) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-4 text-center">
                <h1 className="text-4xl font-bold mb-4">Access Denied</h1>
                <p className="text-gray-400 mb-8 max-w-md">You do not have the necessary permissions to access the administrative panel.</p>
                <button
                    onClick={() => navigate('/')}
                    className="px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-colors"
                >
                    Return Home
                </button>
            </div>
        )
    }

    const menuItems = [
        { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/admin' },
        { name: 'Blogs', icon: <FileText size={20} />, path: '/admin/blogs' },
        { name: 'Gallery', icon: <Images size={20} />, path: '/admin/gallery' },
        { name: 'Users', icon: <Users size={20} />, path: '/admin/users' },
        { name: 'Stores', icon: <ShoppingBag size={20} />, path: '/admin/stores' },
        { name: 'Orders', icon: <CreditCard size={20} />, path: '/admin/orders' },
        { name: 'Placed Orders', icon: <ClipboardList size={20} />, path: '/admin/placed-orders' },
        { name: 'Settings', icon: <Settings size={20} />, path: '/admin/settings' },
    ]

    const handleLogout = async () => {
        try {
            await logout()
            navigate('/login')
        } catch (error) {
            console.error("Failed to log out", error)
        }
    }

    return (
        <div className="min-h-screen bg-[#F8F9FA] flex">
            {/* Sidebar */}
            <aside
                className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-black text-white transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-20'
                    }`}
            >
                <div className="flex flex-col h-full p-6">
                    {/* Brand */}
                    <div className="flex items-center justify-between mb-12">
                        <Link to="/" className={`font-bold text-2xl tracking-tighter ${!isSidebarOpen && 'lg:hidden'}`}>
                            TLF <span className="text-gray-500 font-normal">ADMIN</span>
                        </Link>
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="bg-white/10 p-2 rounded-lg lg:hidden"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="grow space-y-2">
                        {menuItems.map((item) => (
                            <Link
                                key={item.name}
                                to={item.path}
                                className={`flex items-center gap-4 p-4 rounded-xl transition-all ${location.pathname === item.path
                                    ? 'bg-white text-black font-bold'
                                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                    }`}
                            >
                                <span className="shrink-0">{item.icon}</span>
                                <span className={!isSidebarOpen ? 'lg:hidden' : ''}>{item.name}</span>
                                {location.pathname === item.path && isSidebarOpen && (
                                    <ChevronRight size={16} className="ml-auto" />
                                )}
                            </Link>
                        ))}
                    </nav>

                    {/* Profile & Logout */}
                    <div className="mt-auto pt-6 border-t border-white/10">
                        <div className={`flex items-center gap-4 mb-4 ${!isSidebarOpen && 'lg:justify-center'}`}>
                            <img
                                src={userData?.photoURL || `https://ui-avatars.com/api/?name=${userData?.displayName || 'Admin'}`}
                                alt="Admin"
                                className="w-10 h-10 rounded-full border border-white/20"
                            />
                            {isSidebarOpen && (
                                <div className="overflow-hidden">
                                    <p className="text-sm font-bold truncate">{userData?.displayName}</p>
                                    <p className="text-xs text-gray-500 truncate">{userData?.email}</p>
                                </div>
                            )}
                        </div>
                        <button
                            onClick={handleLogout}
                            className={`flex items-center gap-4 w-full p-4 rounded-xl text-red-400 hover:bg-red-400/10 transition-colors ${!isSidebarOpen && 'lg:justify-center'}`}
                        >
                            <LogOut size={20} />
                            <span className={!isSidebarOpen ? 'lg:hidden' : ''}>Logout</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="grow flex flex-col min-h-screen">
                {/* Header */}
                <header className="bg-white border-b border-gray-200 p-4 lg:hidden flex items-center justify-between">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 bg-gray-100 rounded-lg"
                    >
                        <Menu size={20} />
                    </button>
                    <Link to="/" className="font-bold text-xl tracking-tighter">TLF</Link>
                    <div className="w-9" /> {/* Spacer */}
                </header>

                <div className="p-4 md:p-10 grow">
                    <Outlet />
                </div>
            </main>
        </div>
    )
}

export default AdminLayout
