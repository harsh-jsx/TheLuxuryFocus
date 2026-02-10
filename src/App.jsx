import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Lenis from 'lenis'
import Preloader from './components/Preloader'
import Navbar from './components/Navbar'
import Home from './Pages/Home'
import Categories from './Pages/Categories'
import Packages from './Pages/Packages'
import Footer from './components/Footer'

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
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/packages" element={<Packages />} />
      </Routes>
      <Footer />
    </Router>
  )
}

export default App