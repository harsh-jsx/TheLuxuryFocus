import React, { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    Moon,
    Coffee,
    Bed,
    ShoppingBag,
    Utensils,
    LandPlot,
    Building2,
    Plane,
    Gem,
    Home,
    Car,
    Ship,
    HeartPulse,
    Palette,
    PartyPopper,
    Crown,
    Landmark,
    Laptop,
    GraduationCap,
    Scale,
    Paintbrush,
    PawPrint,
    Gift,
    PlusCircle
} from 'lucide-react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const categories = [
    {
        id: 1,
        title: 'NIGHTLIFE',
        icon: <Moon className="w-5 h-5" />,
        image: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=1740&auto=format&fit=crop',
        desc: "It's always time for fun.",
        count: 0,
        color: "#8b5cf6", // Purple
        shapeClass: "rounded-[50px] rounded-tr-[100px] rounded-bl-[100px]"
    },
    {
        id: 2,
        title: 'STAY',
        icon: <Bed className="w-5 h-5" />,
        image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1947&auto=format&fit=crop',
        desc: "Relax, replenish, revive.",
        count: 0,
        color: "#3b82f6", // Blue
        shapeClass: "rounded-[50px] rounded-tl-[100px] rounded-br-[100px]"
    },
    {
        id: 3,
        title: 'MUSEUM',
        icon: <Building2 className="w-5 h-5" />,
        image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1935&auto=format&fit=crop',
        desc: "Tour by the history.",
        count: 0,
        color: "#be185d", // Pink
        shapeClass: "rounded-[60px]"
    },
    {
        id: 4,
        title: 'OUTDOOR',
        icon: <LandPlot className="w-5 h-5" />,
        image: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?q=80&w=2068&auto=format&fit=crop',
        desc: "Outside is the new inside.",
        count: 0,
        color: "#16a34a", // Green
        shapeClass: "rounded-[40px] rounded-tr-[80px]"
    },
    {
        id: 5,
        title: 'RESTAURANT',
        icon: <Utensils className="w-5 h-5" />,
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop',
        desc: "Eat responsibly.",
        count: 0,
        color: "#dc2626", // Red
        shapeClass: "rounded-[50px] rounded-br-[100px] rounded-tl-[30px]"
    },
    {
        id: 6,
        title: 'TOURISM',
        icon: <Plane className="w-5 h-5" />,
        image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2070&auto=format&fit=crop',
        desc: "Dream, breath, explore.",
        count: 0,
        color: "#c026d3", // Fuchsia
        shapeClass: "rounded-[50px] rounded-bl-[90px] rounded-tr-[90px]"
    },
    {
        id: 7,
        title: 'SHOP',
        icon: <ShoppingBag className="w-5 h-5" />,
        image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop',
        desc: "Quality, price and convenience.",
        count: 0,
        color: "#d97706", // Amber
        shapeClass: "rounded-[60px] rounded-tl-[20px]"
    },
    {
        id: 8,
        title: 'CAFE',
        icon: <Coffee className="w-5 h-5" />,
        image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=2070&auto=format&fit=crop',
        desc: "Coffee solves everything.",
        count: 0,
        color: "#991b1b", // Red-900
        shapeClass: "rounded-[100px] h-[300px]" // Pill
    },
    {
        id: 9,
        title: 'HOTEL',
        icon: <Bed className="w-5 h-5" />,
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop',
        desc: "Experience hospitality.",
        count: 0,
        color: "#0d9488", // Teal
        shapeClass: "rounded-[50px] rounded-tr-[90px] rounded-bl-[20px]"
    }
]

const luxuryCategories = [
    { id: 'l1', title: 'Hotels & Resorts', filterCategory: 'Hotels & Resorts', icon: Bed, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop', desc: '5-star hotels, boutique stays, and private villas.', color: '#8b5cf6', shapeClass: 'rounded-[48px] rounded-tr-[90px]' },
    { id: 'l2', title: 'Restaurants & Fine Dining', filterCategory: 'Restaurants & Fine Dining', icon: Utensils, image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop', desc: 'Michelin-style dining and celebrity-chef concepts.', color: '#dc2626', shapeClass: 'rounded-[48px] rounded-bl-[90px]' },
    { id: 'l3', title: 'Travel & Tourism', filterCategory: 'Travel & Tourism', icon: Plane, image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2070&auto=format&fit=crop', desc: 'Luxury travel curation, cruise, and concierge trips.', color: '#2563eb', shapeClass: 'rounded-[52px]' },
    { id: 'l4', title: 'Fashion & Apparel', filterCategory: 'Fashion & Apparel', icon: ShoppingBag, image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop', desc: 'Designer labels, couture, and premium streetwear.', color: '#f97316', shapeClass: 'rounded-[42px] rounded-tr-[78px]' },
    { id: 'l5', title: 'Jewelry & Watches', filterCategory: 'Jewelry & Watches', icon: Gem, image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=2065&auto=format&fit=crop', desc: 'High-end jewelry, watches, and bespoke creations.', color: '#d4af37', shapeClass: 'rounded-[48px] rounded-tl-[90px]' },
    { id: 'l6', title: 'Real Estate', filterCategory: 'Real Estate', icon: Home, image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=2073&auto=format&fit=crop', desc: 'Luxury properties, private islands, and estates.', color: '#0ea5e9', shapeClass: 'rounded-[48px] rounded-br-[88px]' },
    { id: 'l7', title: 'Automobiles', filterCategory: 'Automobiles', icon: Car, image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2083&auto=format&fit=crop', desc: 'Exotic cars, chauffeurs, and collector vehicles.', color: '#ef4444', shapeClass: 'rounded-[52px] rounded-tr-[92px]' },
    { id: 'l8', title: 'Yachts & Aviation', filterCategory: 'Yachts & Aviation', icon: Ship, image: 'https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?q=80&w=2070&auto=format&fit=crop', desc: 'Private yachts, jets, and charter experiences.', color: '#14b8a6', shapeClass: 'rounded-[50px] rounded-bl-[92px]' },
    { id: 'l9', title: 'Beauty & Wellness', filterCategory: 'Beauty & Wellness', icon: HeartPulse, image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1974&auto=format&fit=crop', desc: 'Spas, salons, and premium wellness retreats.', color: '#ec4899', shapeClass: 'rounded-[48px] rounded-tl-[80px]' },
    { id: 'l10', title: 'Art & Collectibles', filterCategory: 'Art & Collectibles', icon: Palette, image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?q=80&w=2070&auto=format&fit=crop', desc: 'Galleries, auction houses, and rare collectibles.', color: '#7c3aed', shapeClass: 'rounded-[54px]' },
    { id: 'l11', title: 'Event Management', filterCategory: 'Event Management', icon: PartyPopper, image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=2070&auto=format&fit=crop', desc: 'Luxury weddings, private parties, and elite events.', color: '#22c55e', shapeClass: 'rounded-[46px] rounded-br-[84px]' },
    { id: 'l12', title: 'Private Clubs & Lifestyle', filterCategory: 'Private Clubs & Lifestyle', icon: Crown, image: 'https://images.unsplash.com/photo-1511882150382-421056c89033?q=80&w=2070&auto=format&fit=crop', desc: 'Members-only communities and concierge services.', color: '#f59e0b', shapeClass: 'rounded-[50px] rounded-tr-[90px]' },
    { id: 'l13', title: 'Finance & Wealth Management', filterCategory: 'Finance & Wealth Management', icon: Landmark, image: 'https://images.unsplash.com/photo-1565514020179-026b92b4a906?q=80&w=2069&auto=format&fit=crop', desc: 'Private banking and wealth advisory firms.', color: '#334155', shapeClass: 'rounded-[52px] rounded-bl-[84px]' },
    { id: 'l14', title: 'Technology & Gadgets', filterCategory: 'Technology & Gadgets', icon: Laptop, image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop', desc: 'Premium electronics and bespoke smart tech.', color: '#0ea5e9', shapeClass: 'rounded-[48px] rounded-tl-[86px]' },
    { id: 'l15', title: 'Education & Training', filterCategory: 'Education & Training', icon: GraduationCap, image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=2032&auto=format&fit=crop', desc: 'Elite schools, tutors, and luxury workshops.', color: '#3b82f6', shapeClass: 'rounded-[46px] rounded-br-[78px]' },
    { id: 'l16', title: 'Health & Medical', filterCategory: 'Health & Medical', icon: HeartPulse, image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2070&auto=format&fit=crop', desc: 'Premium healthcare and personal doctors.', color: '#16a34a', shapeClass: 'rounded-[52px] rounded-tr-[86px]' },
    { id: 'l17', title: 'Legal Services', filterCategory: 'Legal Services', icon: Scale, image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=2070&auto=format&fit=crop', desc: 'Legal services for high-net-worth clients.', color: '#475569', shapeClass: 'rounded-[48px] rounded-bl-[90px]' },
    { id: 'l18', title: 'Interior Design & Architecture', filterCategory: 'Interior Design & Architecture', icon: Paintbrush, image: 'https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?q=80&w=2070&auto=format&fit=crop', desc: 'Bespoke interiors and high-end architecture.', color: '#7c2d12', shapeClass: 'rounded-[50px]' },
    { id: 'l19', title: 'Pet Care & Services', filterCategory: 'Pet Care & Services', icon: PawPrint, image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=2069&auto=format&fit=crop', desc: 'Luxury pet hotels and exclusive pet products.', color: '#a855f7', shapeClass: 'rounded-[44px] rounded-tr-[84px]' },
    { id: 'l20', title: 'Gifting & Luxury Services', filterCategory: 'Gifting & Luxury Services', icon: Gift, image: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?q=80&w=2070&auto=format&fit=crop', desc: 'Premium gifting and bespoke personal shopping.', color: '#e11d48', shapeClass: 'rounded-[50px] rounded-br-[90px]' },
]

const existingCategories = categories.map((category) => ({
    id: `e-${category.id}`,
    title: category.title,
    filterCategory: category.title,
    icon: category.icon.type,
    image: category.image,
    desc: category.desc,
    color: category.color,
    shapeClass: category.shapeClass
}))

const mergedCategories = [...luxuryCategories, ...existingCategories]

const Categories = () => {
    const containerRef = useRef(null)
    const cardsRef = useRef([])
    const navigate = useNavigate()

    useGSAP(() => {
        const cards = cardsRef.current.filter(Boolean)

        gsap.fromTo(cards,
            { y: 100, opacity: 0, scale: 0.9 },
            {
                y: 0,
                opacity: 1,
                scale: 1,
                duration: 1,
                stagger: 0.1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 80%",
                }
            }
        )
    }, { scope: containerRef })

    const goToCategory = (category) => {
        navigate(`/stores?category=${encodeURIComponent(category.filterCategory)}`)
    }

    return (
        <div ref={containerRef} className="min-h-screen bg-white py-32 px-6 overflow-hidden">
            <h1 className="text-5xl md:text-7xl font-[Albra] text-center mb-20 text-black">
                Categories
            </h1>

            <p className="max-w-3xl mx-auto text-center text-gray-500 font-[ABC] text-sm md:text-base mb-14">
                Choose a category to view matching stores instantly. Don't see your business type?
                Use <span className="font-semibold text-gray-700"> Other / Add Category</span>.
            </p>

            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10 items-center justify-items-center">
                {mergedCategories.map((cat, index) => {
                    const Icon = cat.icon
                    return (
                    <div
                        key={cat.id}
                        ref={el => cardsRef.current[index] = el}
                        onClick={() => goToCategory(cat)}
                        className={`group relative w-full h-[320px] max-w-[400px] ${cat.shapeClass} overflow-hidden cursor-pointer shadow-xl transition-all duration-500 hover:shadow-2xl hover:-translate-y-2`}
                    >
                        {/* White Border Effect using inset box-shadow or extra div */}
                        <div className={`absolute inset-0 border-8 border-white z-20 ${cat.shapeClass} pointer-events-none`}></div>

                        {/* Background Image */}
                        <div className="absolute inset-0 overflow-hidden">
                            <img
                                src={cat.image}
                                alt={cat.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            {/* Dark Overlay */}
                            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500"></div>
                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-90"></div>
                        </div>

                        {/* Floating Icon (Top Left) */}
                        <div className="absolute top-6 left-6 z-30">
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-black shadow-lg transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" style={{ color: cat.color }}>
                                <Icon className="w-5 h-5" />
                            </div>
                        </div>

                        {/* Notification Badge (Bottom Right) */}
                        <div className="absolute bottom-6 right-6 z-30">
                            {/* Tear drop shape: Circle with one sharp corner pointing bottom-left or similar */}
                            <div className="w-12 h-12 bg-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300 rounded-full rounded-bl-sm" style={{ backgroundColor: cat.color, color: 'white' }}>
                                <span className="font-bold text-sm font-[ABC]">{cat.count ?? 0}</span>
                            </div>
                            {/* Small pointer decoration */}
                            <div className="absolute -bottom-1 -left-1 w-4 h-4 rounded-full -z-10" style={{ backgroundColor: cat.color }}></div>
                        </div>

                        {/* Content (Center) */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center z-30 pt-10">
                            {/* Ribbon Title */}
                            <div className="relative mb-3">
                                {/* Ribbon ends style */}
                                <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-6 h-8 bg-white skew-x-12 -z-10"></div>
                                <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-6 h-8 bg-white -skew-x-12 -z-10"></div>

                                <div className="bg-white px-8 py-2 relative shadow-lg">
                                    <h3 className="text-black font-bold tracking-widest text-sm md:text-base font-[ABC] uppercase">
                                        {cat.title}
                                    </h3>
                                </div>
                            </div>

                            <p className="text-white/90 font-[ABC] text-xs md:text-sm tracking-wide mt-2 text-center max-w-[70%] font-medium transform translate-y-2 opacity-80 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                {cat.desc}
                            </p>
                        </div>

                        {/* Inner stroke/glow on hover */}
                        <div className={`absolute inset-0 ${cat.shapeClass} border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none`}></div>
                    </div>
                )})}

                <div
                    ref={el => cardsRef.current[mergedCategories.length] = el}
                    onClick={() => goToCategory({ filterCategory: 'Other' })}
                    className="group relative w-full h-[320px] max-w-[400px] rounded-[40px] overflow-hidden cursor-pointer shadow-xl transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 bg-linear-to-br from-gray-900 to-black text-white border border-white/10"
                >
                    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)', backgroundSize: '18px 18px' }} />
                    <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-transparent" />
                    <div className="relative h-full z-10 flex flex-col items-center justify-center text-center p-8">
                        <div className="w-14 h-14 rounded-full bg-white/10 border border-white/15 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                            <PlusCircle className="w-7 h-7 text-white" />
                        </div>
                        <h3 className="font-[ABC] text-sm tracking-[0.18em] uppercase mb-3">Other / Add Category</h3>
                        <p className="font-[ABC] text-xs text-white/75 leading-relaxed max-w-[240px]">
                            If your category is not listed yet, join and choose <span className="font-semibold">Other</span>.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Categories
