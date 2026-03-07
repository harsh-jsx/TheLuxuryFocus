import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Lenis from 'lenis'
import Preloader from './components/Preloader'
import Navbar from './components/Navbar'
import Home from './Pages/Home'
import Categories from './Pages/Categories'
import Packages from './Pages/Packages'
import Footer from './components/Footer'
import Login from './Pages/Login'
import Signup from './Pages/Signup'
import Checkout from './components/Checkout'
import Dashboard from './Pages/Dashboard'
import Stores from './Pages/Stores'
import BlogPost from './Pages/BlogPost'
import AdminLayout from './Pages/Admin/AdminLayout'
import AdminDashboard from './Pages/Admin/AdminDashboard'
import AdminBlogs from './Pages/Admin/AdminBlogs'
import AdminUsers from './Pages/Admin/AdminUsers'
import AdminStores from './Pages/Admin/AdminStores'
import AdminOrders from './Pages/Admin/AdminOrders'
import StoreProfile from './Pages/StoreProfile'
import About from './Pages/About'

import RootLayout from './components/RootLayout'

const App = () => {

  // Smooth Scroll
  useEffect(() => {
    const lenis = new Lenis()

    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)
  }, [])

  return (
    <Router>
      <Preloader />
      <Routes>
        {/* Public Routes with Navbar and Footer */}
        <Route element={<RootLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/packages" element={<Packages />} />
          <Route path="/stores" element={<Stores />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/blog/:id" element={<BlogPost />} />
          <Route path="/store/:id" element={<StoreProfile />} />
        </Route>

        {/* Admin Routes - Clean slate without global Navbar/Footer */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="blogs" element={<AdminBlogs />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="stores" element={<AdminStores />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="settings" element={<div>Settings Component (TBD)</div>} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App