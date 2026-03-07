import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'

const RootLayout = () => {
    return (
        <>
            <Navbar />
            <main>
                <Outlet />
            </main>
            <Footer />
        </>
    )
}

export default RootLayout
