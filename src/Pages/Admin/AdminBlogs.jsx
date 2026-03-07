import React, { useState, useEffect } from 'react'
import { blogService } from '../../services/blogService'
import { Plus, Search, MoreVertical, Edit2, Trash2, Eye, X, Loader2, Image as ImageIcon, FileText } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const AdminBlogs = () => {
    const [blogs, setBlogs] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [currentBlog, setCurrentBlog] = useState(null)
    const [submitting, setSubmitting] = useState(false)

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        category: '',
        excerpt: '',
        content: '',
        image: '',
        author: '',
        readingTime: ''
    })

    useEffect(() => {
        fetchBlogs()
    }, [])

    const fetchBlogs = async () => {
        setLoading(true)
        try {
            const data = await blogService.getAllBlogs()
            setBlogs(data)
        } catch (error) {
            console.error("Error fetching blogs", error)
        } finally {
            setLoading(false)
        }
    }

    const handleOpenForm = (blog = null) => {
        if (blog) {
            setCurrentBlog(blog)
            setFormData({
                title: blog.title || '',
                category: blog.category || '',
                excerpt: blog.excerpt || '',
                content: blog.content || '',
                image: blog.image || '',
                author: blog.author || '',
                readingTime: blog.readingTime || ''
            })
        } else {
            setCurrentBlog(null)
            setFormData({
                title: '',
                category: '',
                excerpt: '',
                content: '',
                image: '',
                author: '',
                readingTime: ''
            })
        }
        setIsFormOpen(true)
    }

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this blog?")) {
            try {
                await blogService.deleteBlog(id)
                setBlogs(blogs.filter(b => b.id !== id))
            } catch (error) {
                console.error("Error deleting blog", error)
            }
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSubmitting(true)
        try {
            if (currentBlog) {
                await blogService.updateBlog(currentBlog.id, formData)
            } else {
                await blogService.addBlog(formData)
            }
            fetchBlogs()
            setIsFormOpen(false)
        } catch (error) {
            console.error("Error saving blog", error)
        } finally {
            setSubmitting(false)
        }
    }

    const filteredBlogs = blogs.filter(blog =>
        blog.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.category?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="max-w-7xl mx-auto">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Blogs</h1>
                    <p className="text-gray-500 mt-1">Manage your website's editorial content.</p>
                </div>
                <button
                    onClick={() => handleOpenForm()}
                    className="flex items-center justify-center gap-2 bg-black text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg shadow-black/10"
                >
                    <Plus size={20} />
                    Add New Article
                </button>
            </header>

            {/* toolbar */}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm mb-6 flex items-center gap-4">
                <div className="relative grow max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search articles..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
                    />
                </div>
            </div>

            {/* List */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24">
                        <Loader2 className="w-10 h-10 animate-spin text-gray-200 mb-4" />
                        <p className="text-gray-400 font-medium font-[ABC] uppercase tracking-widest text-xs">Loading Content...</p>
                    </div>
                ) : filteredBlogs.length === 0 ? (
                    <div className="text-center py-24">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FileText size={32} className="text-gray-300" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">No blogs found</h3>
                        <p className="text-gray-500">Try adjusting your search or add a new article.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Article</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Category</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Date</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Author</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredBlogs.map((blog) => (
                                    <tr key={blog.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-gray-100">
                                                    <img src={blog.image} alt="" className="w-full h-full object-cover" />
                                                </div>
                                                <div className="max-w-xs md:max-w-sm">
                                                    <p className="font-bold text-gray-900 truncate">{blog.title}</p>
                                                    <p className="text-xs text-gray-500 truncate">{blog.excerpt}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold">
                                                {blog.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{blog.date}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900 font-medium">{blog.author || 'The Luxury Focus'}</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => window.open(`/blog/${blog.id}`, '_blank')}
                                                    className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition-all"
                                                    title="View"
                                                >
                                                    <Eye size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleOpenForm(blog)}
                                                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                    title="Edit"
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(blog.id)}
                                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={18} />
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

            {/* Form Modal */}
            <AnimatePresence mode="wait">
                {isFormOpen && (
                    <div key="blog-form-modal" className="fixed inset-0 z-9999 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsFormOpen(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[2.5rem] shadow-2xl overflow-hidden relative z-10 flex flex-col"
                        >
                            <header className="p-8 border-b border-gray-100 flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold">{currentBlog ? 'Edit Article' : 'New Article'}</h2>
                                    <p className="text-gray-500 text-sm mt-1">Fill in the details for your blog post.</p>
                                </div>
                                <button
                                    onClick={() => setIsFormOpen(false)}
                                    className="p-3 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </header>

                            <form onSubmit={handleSubmit} className="grow overflow-y-auto p-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Left Column */}
                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Title</label>
                                            <input
                                                required
                                                type="text"
                                                value={formData.title}
                                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all font-medium"
                                                placeholder="Enter article title"
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Category</label>
                                                <select
                                                    required
                                                    value={formData.category}
                                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all font-medium"
                                                >
                                                    <option value="">Select Category</option>
                                                    <option value="Real Estate">Real Estate</option>
                                                    <option value="Lifestyle">Lifestyle</option>
                                                    <option value="Investment">Investment</option>
                                                    <option value="Technology">Technology</option>
                                                    <option value="Hospitality">Hospitality</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Read Time</label>
                                                <input
                                                    type="text"
                                                    value={formData.readingTime}
                                                    onChange={(e) => setFormData({ ...formData, readingTime: e.target.value })}
                                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all font-medium"
                                                    placeholder="e.g. 5 min"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Excerpt</label>
                                            <textarea
                                                rows="3"
                                                value={formData.excerpt}
                                                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all font-medium resize-none"
                                                placeholder="A brief summary of the article..."
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Author Name</label>
                                            <input
                                                type="text"
                                                value={formData.author}
                                                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all font-medium"
                                                placeholder="Author name"
                                            />
                                        </div>
                                    </div>

                                    {/* Right Column */}
                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Cover Image URL</label>
                                            <div className="flex gap-4">
                                                <input
                                                    required
                                                    type="url"
                                                    value={formData.image}
                                                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                                    className="grow px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all font-medium text-sm"
                                                    placeholder="https://images.unsplash.com/..."
                                                />
                                            </div>
                                        </div>

                                        {/* Image Preview */}
                                        <div className="aspect-video w-full rounded-4xl bg-gray-50 border-2 border-dashed border-gray-100 overflow-hidden flex items-center justify-center">
                                            {formData.image ? (
                                                <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="text-center">
                                                    <ImageIcon size={48} className="text-gray-200 mx-auto mb-2" />
                                                    <p className="text-gray-300 text-sm font-bold uppercase tracking-widest">Image Preview</p>
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Content (HTML Supported)</label>
                                            <textarea
                                                required
                                                rows="6"
                                                value={formData.content}
                                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all font-medium resize-none text-sm"
                                                placeholder="Write your article content here in HTML format..."
                                            />
                                        </div>
                                    </div>
                                </div>

                                <footer className="mt-12 flex items-center justify-end gap-4 pb-8">
                                    <button
                                        type="button"
                                        onClick={() => setIsFormOpen(false)}
                                        className="px-8 py-3 rounded-xl font-bold bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all font-[ABC] uppercase tracking-widest text-xs"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="px-10 py-3 rounded-xl font-bold bg-black text-white hover:bg-gray-800 transition-all font-[ABC] uppercase tracking-widest text-xs flex items-center gap-2"
                                    >
                                        {submitting && <Loader2 size={14} className="animate-spin" />}
                                        {currentBlog ? 'Update Article' : 'Publish Article'}
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

export default AdminBlogs
