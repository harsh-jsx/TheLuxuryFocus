import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Preloader from './components/Preloader'
import Navbar from './components/Navbar'
import Home from './components/Home'
const App = () => {
  return (
    <Router>
      <Preloader />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  )
}

export default App