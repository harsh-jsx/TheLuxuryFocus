import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import PaymentReturnHandler from './PaymentReturnHandler'

const RootLayout = () => {
    return (
        <>
            <PaymentReturnHandler />
            <Navbar />
            <main>
                <Outlet />
            </main>
            <Footer />
        </>
    )
}

export default RootLayout
