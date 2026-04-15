import { useEffect, useRef } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Preloader from "./components/Preloader";
import Navbar from "./components/Navbar";
import Home from "./Pages/Home";
import Categories from "./Pages/Categories";
import Packages from "./Pages/Packages";
import Footer from "./components/Footer";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import Checkout from "./components/Checkout";
import Dashboard from "./Pages/Dashboard";
import Stores from "./Pages/Stores";
import BlogPost from "./Pages/BlogPost";
import AdminLayout from "./Pages/Admin/AdminLayout";
import AdminDashboard from "./Pages/Admin/AdminDashboard";
import AdminBlogs from "./Pages/Admin/AdminBlogs";
import AdminUsers from "./Pages/Admin/AdminUsers";
import AdminStores from "./Pages/Admin/AdminStores";
import AdminOrders from "./Pages/Admin/AdminOrders";
import AdminGallery from "./Pages/Admin/AdminGallery";
import StoreProfile from "./Pages/StoreProfile";
import About from "./Pages/About";
import PaymentReturn from "./Pages/PaymentReturn";
import Gallery from "./Pages/Gallery";
import GalleryItem from "./Pages/GalleryItem";
import { Analytics } from "@vercel/analytics/react";
import RootLayout from "./components/RootLayout";
import TNC from "./PolicyPages/TNC";
import PPolicy from "./PolicyPages/PPolicy";
import CPolicy from "./PolicyPages/CPolicy";
import Disclaimer from "./PolicyPages/Disclaimer";
import RefundPolicy from "./PolicyPages/RefundPolicy";
import Sitemap from "./PolicyPages/Sitemap";

gsap.registerPlugin(ScrollTrigger);

function ScrollToTop({ lenisRef }) {
  const { pathname, search } = useLocation();

  useEffect(() => {
    const lenis = lenisRef.current;
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    }
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [pathname, search]);

  return null;
}

const App = () => {
  const lenisRef = useRef(null);

  // Smooth scroll + ScrollTrigger: Lenis must share GSAP's ticker or triggers stay wrong.
  // See https://github.com/darkroomengineering/lenis#gsap-scrolltrigger
  useEffect(() => {
    const lenis = new Lenis();
    lenisRef.current = lenis;

    const offLenisScroll = lenis.on("scroll", ScrollTrigger.update);

    const onTick = (time) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      offLenisScroll();
      gsap.ticker.remove(onTick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return (
    <Router>
      <ScrollToTop lenisRef={lenisRef} />
      <Analytics />
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
          <Route path="/payment-return" element={<PaymentReturn />} />
          <Route path="/blog/:id" element={<BlogPost />} />
          <Route path="/store/:id" element={<StoreProfile />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/gallery/:id" element={<GalleryItem />} />
          <Route path="/terms" element={<TNC />} />
          <Route path="/privacy" element={<PPolicy />} />
          <Route path="/cookies" element={<CPolicy />} />
          <Route path="/disclaimer" element={<Disclaimer />} />
          <Route path="/refund" element={<RefundPolicy />} />
          <Route path="/sitemap" element={<Sitemap />} />
        </Route>

        {/* Admin Routes - Clean slate without global Navbar/Footer */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="blogs" element={<AdminBlogs />} />
          <Route path="gallery" element={<AdminGallery />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="stores" element={<AdminStores />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route
            path="settings"
            element={<div>Settings Component (TBD)</div>}
          />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
