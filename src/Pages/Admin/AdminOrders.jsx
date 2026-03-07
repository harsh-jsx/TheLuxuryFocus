import React, { useState, useEffect } from 'react'
import { orderService } from '../../services/orderService'
import { Search, Edit2, Trash2, X, Loader2, CreditCard, User, Box, Clock, Calendar, CheckCircle, AlertCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const AdminOrders = () => {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [selectedOrder, setSelectedOrder] = useState(null)
    const [submitting, setSubmitting] = useState(false)

    // Form State (Simplified for editing status and basic fields)
    const [formData, setFormData] = useState({
        status: '',
        amount: '',
        packageName: '',
        packagePrice: ''
    })

    useEffect(() => {
        fetchOrders()
    }, [])

    const fetchOrders = async () => {
        setLoading(true)
        try {
            const data = await orderService.getAllOrders()
            setOrders(data)
        } catch (error) {
            console.error("Error fetching orders", error)
        } finally {
            setLoading(false)
        }
    }

    const handleOpenEdit = (order) => {
        setSelectedOrder(order)
        setFormData({
            status: order.status || '',
            amount: order.amount || '',
            packageName: order.packageName || '',
            packagePrice: order.packagePrice || ''
        })
        setIsEditModalOpen(true)
    }

    const handleUpdate = async (e) => {
        e.preventDefault()
        setSubmitting(true)
        try {
            await orderService.updateOrder(selectedOrder.id, formData)
            await fetchOrders()
            setIsEditModalOpen(false)
        } catch (error) {
            console.error("Error updating order", error)
        } finally {
            setSubmitting(false)
        }
    }

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this order record? This cannot be undone.")) {
            try {
                await orderService.deleteOrder(id)
                setOrders(orders.filter(o => o.id !== id))
            } catch (error) {
                console.error("Error deleting order", error)
            }
        }
    }

    const getStatusColor = (status) => {
        switch (status?.toUpperCase()) {
            case 'SUCCESS': return 'bg-green-100 text-green-700'
            case 'PENDING': return 'bg-yellow-100 text-yellow-700'
            case 'FAILED': return 'bg-red-100 text-red-700'
            default: return 'bg-gray-100 text-gray-700'
        }
    }

    const filteredOrders = orders.filter(order =>
        order.customer?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.paymentId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.packageName?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="max-w-7xl mx-auto">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Orders</h1>
                    <p className="text-gray-500 mt-1">Track and manage service subscriptions and payments.</p>
                </div>
                <div className="bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-900">{orders.length}</span>
                    <span className="text-sm text-gray-500 font-medium">Total Vol.</span>
                </div>
            </header>

            {/* Toolbar */}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm mb-6 flex items-center gap-4">
                <div className="relative grow max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by customer name, payment ID or package..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
                    />
                </div>
            </div>

            {/* Order List */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24">
                        <Loader2 className="w-10 h-10 animate-spin text-gray-200 mb-4" />
                        <p className="text-gray-400 font-medium font-[ABC] uppercase tracking-widest text-xs">Accessing Ledgers...</p>
                    </div>
                ) : filteredOrders.length === 0 ? (
                    <div className="text-center py-24 text-gray-500">
                        No orders recorded yet.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left font-medium">
                            <thead className="bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-widest">
                                <tr>
                                    <th className="px-6 py-4">Transaction Details</th>
                                    <th className="px-6 py-4">Customer</th>
                                    <th className="px-6 py-4">Package</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
                                                    <CreditCard size={18} />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-gray-900">{order.amount || order.packagePrice}</p>
                                                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">{order.paymentId}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="text-sm text-gray-900 font-bold">{order.customer?.fullName}</p>
                                                <p className="text-xs text-gray-400">{order.customer?.email}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm text-gray-700">{order.packageName}</span>
                                                <span className="text-[10px] text-gray-400">ID: {order.packageId}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusColor(order.status)}`}>
                                                {order.status === 'SUCCESS' ? <CheckCircle size={10} /> : <AlertCircle size={10} />}
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => handleOpenEdit(order)}
                                                    className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition-all"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(order.id)}
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

            {/* Edit Order Modal */}
            <AnimatePresence mode="wait">
                {isEditModalOpen && (
                    <div key="order-edit-modal" className="fixed inset-0 z-9999 flex items-center justify-center p-4">
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
                                        <Box size={24} />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold">Edit Transaction</h2>
                                        <p className="text-xs text-gray-500 font-medium uppercase tracking-widest mt-0.5">Order ID: {selectedOrder?.id}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </header>

                            <form onSubmit={handleUpdate} className="p-8 space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Status Section */}
                                    <div className="space-y-3">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                            <Clock size={12} /> Transaction Status
                                        </label>
                                        <select
                                            value={formData.status}
                                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all font-bold"
                                        >
                                            <option value="SUCCESS">SUCCESS</option>
                                            <option value="PENDING">PENDING</option>
                                            <option value="FAILED">FAILED</option>
                                        </select>
                                    </div>

                                    {/* Amount Section */}
                                    <div className="space-y-3">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                            <CreditCard size={12} /> Amount Paid
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.amount}
                                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all font-bold"
                                        />
                                    </div>

                                    {/* Package Name */}
                                    <div className="space-y-3">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                            <Box size={12} /> Active Package
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.packageName}
                                            onChange={(e) => setFormData({ ...formData, packageName: e.target.value })}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all font-medium"
                                        />
                                    </div>

                                    {/* Package Price */}
                                    <div className="space-y-3">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                            <Tag size={12} /> List Price
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.packagePrice}
                                            onChange={(e) => setFormData({ ...formData, packagePrice: e.target.value })}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all font-medium"
                                        />
                                    </div>
                                </div>

                                {/* Read Only Customer Info Summary */}
                                <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Customer Details Reference</p>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <p className="text-gray-400 text-[10px] uppercase font-bold mb-1">Full Name</p>
                                            <p className="font-bold text-gray-900">{selectedOrder?.customer?.fullName}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-400 text-[10px] uppercase font-bold mb-1">Email</p>
                                            <p className="font-medium text-gray-700">{selectedOrder?.customer?.email}</p>
                                        </div>
                                        <div className="col-span-2">
                                            <p className="text-gray-400 text-[10px] uppercase font-bold mb-1">Shipping Address</p>
                                            <p className="text-gray-600 leading-tight">
                                                {selectedOrder?.customer?.address}, {selectedOrder?.customer?.city}, {selectedOrder?.customer?.zipCode}
                                            </p>
                                        </div>
                                    </div>
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
                                        Update Record
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

export default AdminOrders
