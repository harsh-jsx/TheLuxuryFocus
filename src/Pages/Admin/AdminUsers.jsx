import React, { useState, useEffect } from 'react'
import { userService } from '../../services/userService'
import { Search, Edit2, Trash2, X, Loader2, User, Mail, Shield, Calendar, Phone } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const AdminUsers = () => {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [selectedUser, setSelectedUser] = useState(null)
    const [submitting, setSubmitting] = useState(false)

    // Form State
    const [formData, setFormData] = useState({
        displayName: '',
        email: '',
        photoURL: '',
        is_admin: false,
        phoneNumber: ''
    })

    useEffect(() => {
        fetchUsers()
    }, [])

    const fetchUsers = async () => {
        setLoading(true)
        try {
            const data = await userService.getAllUsers()
            setUsers(data)
        } catch (error) {
            console.error("Error fetching users", error)
        } finally {
            setLoading(false)
        }
    }

    const handleOpenEdit = (user) => {
        setSelectedUser(user)
        setFormData({
            displayName: user.displayName || '',
            email: user.email || '',
            photoURL: user.photoURL || '',
            is_admin: user.is_admin || false,
            phoneNumber: user.phoneNumber || ''
        })
        setIsEditModalOpen(true)
    }

    const handleUpdate = async (e) => {
        e.preventDefault()
        setSubmitting(true)
        try {
            await userService.updateUser(selectedUser.id, formData)
            await fetchUsers()
            setIsEditModalOpen(false)
        } catch (error) {
            console.error("Error updating user", error)
        } finally {
            setSubmitting(false)
        }
    }

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
            try {
                await userService.deleteUser(id)
                setUsers(users.filter(u => u.id !== id))
            } catch (error) {
                console.error("Error deleting user", error)
            }
        }
    }

    const filteredUsers = users.filter(user =>
        user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="max-w-7xl mx-auto">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Users</h1>
                    <p className="text-gray-500 mt-1">Manage user accounts and permissions.</p>
                </div>
                <div className="bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-900">{users.length}</span>
                    <span className="text-sm text-gray-500 font-medium">Total Registered</span>
                </div>
            </header>

            {/* Toolbar */}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm mb-6 flex items-center gap-4">
                <div className="relative grow max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search users by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
                    />
                </div>
            </div>

            {/* User List */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24">
                        <Loader2 className="w-10 h-10 animate-spin text-gray-200 mb-4" />
                        <p className="text-gray-400 font-medium font-[ABC] uppercase tracking-widest text-xs">Loading Directory...</p>
                    </div>
                ) : filteredUsers.length === 0 ? (
                    <div className="text-center py-24 text-gray-500">
                        No users found.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-widest">
                                <tr>
                                    <th className="px-6 py-4">User</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Phone</th>
                                    <th className="px-6 py-4">Joined</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-gray-100">
                                                    <img
                                                        src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName || 'U'}`}
                                                        alt=""
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900">{user.displayName || 'Anonymous'}</p>
                                                    <p className="text-xs text-gray-500">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {user.is_admin ? (
                                                <span className="inline-flex items-center gap-1 bg-black text-white px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider">
                                                    <Shield size={10} /> Admin
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-400 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider">
                                                    User
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500 font-medium">
                                            {user.phoneNumber || '—'}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-400">
                                            {user.createdAt?.toDate ? new Date(user.createdAt.toDate()).toLocaleDateString() : 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => handleOpenEdit(user)}
                                                    className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition-all"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(user.id)}
                                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Edit User Modal */}
            <AnimatePresence mode="wait">
                {isEditModalOpen && (
                    <div key="user-edit-modal" className="fixed inset-0 z-9999 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsEditModalOpen(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white w-full max-w-2xl rounded-4xl shadow-2xl overflow-hidden relative z-10"
                        >
                            <header className="p-8 border-b border-gray-100 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center text-white">
                                        <User size={24} />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold">Edit User Details</h2>
                                        <p className="text-xs text-gray-500 font-medium uppercase tracking-widest mt-0.5">ID: {selectedUser?.id}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </header>

                            <form onSubmit={handleUpdate} className="p-8 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Display Name */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                            <User size={12} /> Full Name
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.displayName}
                                            onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all font-medium"
                                        />
                                    </div>

                                    {/* Email (Read Only for security usually, but editable if requested) */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                            <Mail size={12} /> Email Address
                                        </label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all font-medium text-gray-500"
                                        />
                                    </div>

                                    {/* Phone Number */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                            <Phone size={12} /> Phone Number
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.phoneNumber}
                                            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all font-medium"
                                            placeholder="+1 234 567 890"
                                        />
                                    </div>

                                    {/* Photo URL */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                            <Calendar size={12} /> Photo URL
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.photoURL}
                                            onChange={(e) => setFormData({ ...formData, photoURL: e.target.value })}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all font-medium"
                                        />
                                    </div>
                                </div>

                                {/* Permissions Toggle */}
                                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${formData.is_admin ? 'bg-black text-white' : 'bg-gray-200 text-gray-400'}`}>
                                            <Shield size={20} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900">Administrator Privileges</p>
                                            <p className="text-xs text-gray-500">Enable full access to the admin panel</p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, is_admin: !formData.is_admin })}
                                        className={`w-14 h-8 rounded-full relative transition-colors duration-300 ${formData.is_admin ? 'bg-black' : 'bg-gray-200'}`}
                                    >
                                        <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all duration-300 ${formData.is_admin ? 'left-7' : 'left-1'}`} />
                                    </button>
                                </div>

                                <footer className="pt-4 flex items-center justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsEditModalOpen(false)}
                                        className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-all text-xs uppercase tracking-widest"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="px-8 py-3 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition-all text-xs uppercase tracking-widest flex items-center gap-2"
                                    >
                                        {submitting && <Loader2 size={14} className="animate-spin" />}
                                        Save Changes
                                    </button>
                                </footer>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default AdminUsers
