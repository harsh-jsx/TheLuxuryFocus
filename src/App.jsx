import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Preloader from './components/Preloader'
import Navbar from './components/Navbar'
import home from './pages/home'
const App = () => {
  return (
    <Router>
      <Preloader />
      <Navbar />
      <Routes>
        <Route path="/" element={<home />} />
      </Routes>
    </Router>
  )
}

export default App