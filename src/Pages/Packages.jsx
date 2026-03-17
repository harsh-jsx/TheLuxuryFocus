import React, { useRef } from 'react';
import {
    Check,
    X,
    ArrowRight,
    Image,
    Video,
    Link as LinkIcon,
    MessageCircle,
    BarChart3,
    Clock,
    Users,
    Mic,
    Mail,
    Calendar,
    Sparkles,
} from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, AnimatePresence } from 'framer-motion';
import SplitText from '../components/SplitText';
import { useSelectedPackageOptionStore } from '../stores/packageStore';
import { useNavigate } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

const ACCENT = {
    amber: '#C9A227',
    amberLight: '#E8D5A3',
    amberBg: 'rgba(201, 162, 39, 0.08)',
};

const PACKAGES = [
    {
        id: 1,
        name: 'Basic',
        price: '₹200',
        description: 'Essential presence for starters.',
        features: [
            { name: '2-3 Basic Images', included: true, icon: Image },
            { name: 'Website Link', included: true, icon: LinkIcon },
            { name: 'Contact & Email', included: true, icon: Mail },
            { name: 'Video Uploads', included: false, icon: Video },
            { name: 'Social Media', included: false, icon: Users },
        ],
    },
    {
        id: 2,
        name: 'Standard',
        price: '₹500',
        tag: 'Popular',
        description: 'Enhanced visibility with multimedia.',
        features: [
            { name: '5 Images', included: true, icon: Image },
            { name: '2 Videos', included: true, icon: Video },
            { name: 'YouTube & Instagram', included: true, icon: LinkIcon },
            { name: 'Full Social Integration', included: true, icon: Users },
            { name: 'Analytics', included: false, icon: BarChart3 },
        ],
    },
    {
        id: 3,
        name: 'Premium',
        price: '₹2000',
        tag: 'Best Value',
        description: 'Maximum impact and priority support.',
        features: [
            { name: 'Up to 25 Pictures', included: true, icon: Image },
            { name: '10 Videos', included: true, icon: Video },
            { name: 'All Social Links', included: true, icon: LinkIcon },
            { name: 'Priority Support', included: true, icon: Clock },
            { name: '24/7 WhatsApp Bot', included: true, icon: MessageCircle },
            { name: 'Reviews & Analytics', included: true, icon: BarChart3 },
        ],
    },
];

const ADDONS = [
    { title: 'Social Media Management', price: 'Hourly', icon: Users },
    { title: 'Content Creation', price: 'Hourly', icon: Video },
    { title: 'Marketing', price: 'Hourly', icon: BarChart3 },
    { title: 'Telecalling', price: 'Hourly', icon: MessageCircle },
    { title: 'Email Marketing', price: 'Hourly', icon: Mail },
    { title: 'SMS Marketing', price: 'Hourly', icon: MessageCircle },
    { title: 'Event Anchoring', price: '₹2500/day', icon: Mic },
    { title: 'Event Management', price: 'Custom', icon: Calendar },
];

const Packages = () => {
    const navigate = useNavigate();
    const selectedPackageOption = useSelectedPackageOptionStore((s) => s.selectedPackageOption);
    const setSelectedPackageOption = useSelectedPackageOptionStore((s) => s.setSelectedPackageOption);

    const rootRef = useRef(null);
    const heroRef = useRef(null);
    const pricingSectionRef = useRef(null);
    const cardRefs = useRef([]);
    const addonsSectionRef = useRef(null);
    const addonRefs = useRef([]);

    const selectPackage = (pkg) => {
        setSelectedPackageOption(pkg);
        setTimeout(() => navigate('/checkout'), 600);
    };

    useGSAP(() => {
        const root = rootRef.current;
        if (!root) return;

        const ctx = gsap.context(() => {
            const hero = heroRef.current;
            if (hero) {
                const line = hero.querySelector('.hero-line');
                const badge = hero.querySelector('.hero-badge');
                const underline = hero.querySelector('.hero-underline');
                if (line) gsap.fromTo(line, { scaleX: 0 }, { scaleX: 1, duration: 0.7, ease: 'power2.out' });
                if (badge) gsap.fromTo(badge, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' });
                if (underline) gsap.fromTo(underline, { scaleX: 0 }, { scaleX: 1, duration: 0.8, delay: 0.5, ease: 'power2.inOut' });
            }

            const section = pricingSectionRef.current;
            const cards = cardRefs.current.filter(Boolean);
            if (section && cards.length) {
                gsap.set(cards, { y: 56, opacity: 0 });
                gsap.to(cards, {
                    y: 0,
                    opacity: 1,
                    duration: 0.75,
                    stagger: 0.15,
                    ease: 'power3.out',
                    scrollTrigger: { trigger: section, start: 'top 80%', once: true },
                });
                // Stagger feature items inside each card
                cards.forEach((card, i) => {
                    const items = card?.querySelectorAll('.feature-item');
                    if (items?.length) {
                        gsap.set(items, { x: -12, opacity: 0 });
                        gsap.to(items, {
                            x: 0,
                            opacity: 1,
                            duration: 0.4,
                            stagger: 0.04,
                            delay: 0.2 + i * 0.15,
                            ease: 'power2.out',
                            scrollTrigger: { trigger: section, start: 'top 80%', once: true },
                        });
                    }
                });
            }

            // Subtle float on featured (middle) card — start after cards have entered
            const featuredCard = cards[1];
            if (featuredCard) {
                gsap.to(featuredCard, {
                    y: -6,
                    duration: 2.2,
                    ease: 'sine.inOut',
                    yoyo: true,
                    repeat: -1,
                    delay: 1,
                    scrollTrigger: { trigger: section, start: 'top 60%', end: 'bottom 20%', once: false },
                });
            }

            const addonsSection = addonsSectionRef.current;
            const addonEls = addonRefs.current.filter(Boolean);
            if (addonsSection && addonEls.length) {
                gsap.set(addonEls, { y: 36, opacity: 0 });
                gsap.to(addonEls, {
                    y: 0,
                    opacity: 1,
                    duration: 0.5,
                    stagger: 0.06,
                    ease: 'power3.out',
                    scrollTrigger: { trigger: addonsSection, start: 'top 85%', once: true },
                });
            }
        }, root);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={rootRef} className="min-h-screen bg-white text-gray-900 relative overflow-hidden">
            {/* Background graphics */}
            <div className="pointer-events-none absolute inset-0">
                <div
                    className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full opacity-30 blur-[100px]"
                    style={{ background: `radial-gradient(circle, ${ACCENT.amberLight} 0%, transparent 70%)` }}
                />
                <div className="absolute top-1/2 -left-32 w-80 h-80 rounded-full bg-indigo-100/40 blur-[80px]" />
                <div
                    className="absolute bottom-20 right-0 w-[400px] h-[400px] rounded-full opacity-20 blur-[90px]"
                    style={{ background: `radial-gradient(circle, ${ACCENT.amberLight} 0%, transparent 70%)` }}
                />
                {/* Subtle grid */}
                <div
                    className="absolute inset-0 opacity-[0.02]"
                    style={{
                        backgroundImage: `linear-gradient(to right, #000 1px, transparent 1px),
                                         linear-gradient(to bottom, #000 1px, transparent 1px)`,
                        backgroundSize: '48px 48px',
                    }}
                />
            </div>

            {/* Hero */}
            <section ref={heroRef} className="relative pt-32 pb-20 md:pb-28 px-6 md:px-10">
                <div className="max-w-4xl relative z-10">
                    <div
                        className="hero-badge inline-flex items-center gap-2 px-4 py-2.5 rounded-full mb-8 font-[ABC] text-xs uppercase tracking-widest border"
                        style={{ backgroundColor: ACCENT.amberBg, color: ACCENT.amber, borderColor: `${ACCENT.amber}30` }}
                    >
                        <Sparkles size={14} />
                        Plans & pricing
                    </div>
                    <div
                        className="hero-line h-1 w-24 rounded-full origin-left mb-8"
                        style={{ background: `linear-gradient(90deg, ${ACCENT.amber}, #1f2937)` }}
                    />
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-[Albra] tracking-tight leading-[1.08] max-w-3xl">
                        <SplitText scrollTrigger={false} delay={0.15} stagger={0.06} animationType="spring">
                            Plans that
                        </SplitText>{' '}
                        <span style={{ color: ACCENT.amber }} className="inline-block">
                            <SplitText scrollTrigger={false} delay={0.35} stagger={0.04} type="chars" animationType="spring">
                                scale
                            </SplitText>
                        </span>{' '}
                        <SplitText scrollTrigger={false} delay={0.5} stagger={0.06} animationType="spring">
                            with you.
                        </SplitText>
                    </h1>
                    <div className="relative mt-4 w-full max-w-3xl">
                        <div
                            className="hero-underline absolute left-0 top-0 h-1 rounded-full origin-left"
                            style={{ width: '140px', background: `linear-gradient(90deg, ${ACCENT.amber}, transparent)` }}
                        />
                    </div>
                    <div className="mt-8 text-lg text-gray-600 font-[ABC] max-w-xl leading-relaxed">
                        <SplitText scrollTrigger={false} delay={0.65} stagger={0.03} animationType="fade">
                            Choose a listing plan or add bespoke services. Simple pricing, no hidden fees.
                        </SplitText>
                    </div>
                </div>
            </section>

            {/* Pricing cards */}
            <section ref={pricingSectionRef} className="relative px-6 md:px-10 pb-24 md:pb-36">
                <div className="max-w-6xl mx-auto">
                    <p
                        className="font-[ABC] text-xs uppercase tracking-widest mb-3"
                        style={{ color: ACCENT.amber }}
                    >
                        Compare plans
                    </p>
                    <h2 className="text-2xl md:text-4xl font-[Albra] text-gray-900 mb-14">
                        <SplitText scrollTrigger={true} stagger={0.05} animationType="fade" once={true}>
                            Choose your plan
                        </SplitText>
                    </h2>
                </div>
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-stretch">
                    {PACKAGES.map((pkg, i) => {
                        const selected = selectedPackageOption?.id === pkg.id;
                        const featured = !!pkg.tag;
                        return (
                            <article
                                key={pkg.id}
                                ref={(el) => (cardRefs.current[i] = el)}
                                className={`relative rounded-3xl border-2 bg-white/90 backdrop-blur-sm flex flex-col overflow-hidden transition-all duration-300 ${
                                    selected
                                        ? 'border-gray-900 shadow-2xl shadow-gray-900/15'
                                        : featured
                                        ? 'border-amber-200 shadow-xl md:shadow-2xl md:-mt-4 md:mb-4 ring-2 ring-amber-100'
                                        : 'border-gray-100 hover:border-amber-100 hover:shadow-lg'
                                }`}
                            >
                                {pkg.tag && (
                                    <div
                                        className="absolute top-0 left-0 right-0 h-1.5 rounded-t-3xl"
                                        style={{ background: `linear-gradient(90deg, ${ACCENT.amber}, ${ACCENT.amberLight})` }}
                                    />
                                )}
                                <div className="p-7 md:p-8 flex flex-col flex-1">
                                    <div className="mb-6">
                                        {pkg.tag && (
                                            <span
                                                className="inline-block text-[10px] font-[ABC] uppercase tracking-widest mb-2"
                                                style={{ color: ACCENT.amber }}
                                            >
                                                {pkg.tag}
                                            </span>
                                        )}
                                        <h2 className="text-xl font-[Albra] text-gray-900">{pkg.name}</h2>
                                        <p className="mt-1 text-3xl md:text-4xl font-[Albra] tracking-tight text-gray-900">
                                            {pkg.price}
                                        </p>
                                        <p className="mt-3 text-sm text-gray-500 font-[ABC] leading-relaxed">
                                            {pkg.description}
                                        </p>
                                    </div>

                                    <ul className="space-y-3 flex-1 mb-8">
                                        {pkg.features.map((f, j) => {
                                            const Icon = f.icon;
                                            return (
                                                <li key={j} className="feature-item flex items-center gap-3">
                                                    <span
                                                        className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                                                            f.included
                                                                ? 'text-white'
                                                                : 'bg-gray-100 text-gray-300'
                                                        }`}
                                                        style={f.included ? { backgroundColor: ACCENT.amber } : {}}
                                                    >
                                                        {f.included ? <Check size={12} /> : <X size={12} />}
                                                    </span>
                                                    <span className={`text-sm font-[ABC] flex items-center gap-2 ${f.included ? 'text-gray-700' : 'text-gray-400'}`}>
                                                        <Icon size={14} className="opacity-50" />
                                                        {f.name}
                                                    </span>
                                                </li>
                                            );
                                        })}
                                    </ul>

                                    <button
                                        type="button"
                                        disabled={selected}
                                        onClick={() => selectPackage(pkg)}
                                        className={`w-full py-4 rounded-xl font-[ABC] text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all duration-300 ${
                                            selected
                                                ? 'cursor-wait'
                                                : featured
                                                ? 'hover:opacity-90 hover:scale-[1.02]'
                                                : 'bg-gray-900 text-white hover:bg-gray-800'
                                        }`}
                                        style={
                                            selected
                                                ? { backgroundColor: ACCENT.amber, color: '#fff' }
                                                : featured
                                                ? { backgroundColor: ACCENT.amber, color: '#1f2937' }
                                                : {}
                                        }
                                    >
                                        {selected ? 'Redirecting…' : 'Get started'}
                                        {!selected && <ArrowRight size={16} />}
                                    </button>
                                </div>
                            </article>
                        );
                    })}
                </div>
            </section>

            {/* Add-ons */}
            <section ref={addonsSectionRef} className="relative px-6 md:px-10 pb-28 md:pb-40">
                <div className="max-w-6xl mx-auto">
                    <p
                        className="font-[ABC] text-xs uppercase tracking-widest mb-2"
                        style={{ color: ACCENT.amber }}
                    >
                        Add-ons
                    </p>
                    <h2 className="text-2xl md:text-3xl font-[Albra] text-gray-900 mb-10">
                        <SplitText scrollTrigger={true} stagger={0.04} animationType="fade" once={true}>
                            Personalized services
                        </SplitText>
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {ADDONS.map((item, i) => {
                            const Icon = item.icon;
                            return (
                                <div
                                    key={i}
                                    ref={(el) => (addonRefs.current[i] = el)}
                                    className="group p-5 rounded-2xl border border-gray-100 bg-white/80 backdrop-blur-sm hover:border-amber-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                                >
                                    <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-3 text-amber-800/90 bg-amber-100/80 group-hover:bg-[#C9A227] group-hover:text-white transition-all duration-300 group-hover:scale-105">
                                        <Icon size={20} />
                                    </div>
                                    <p className="font-[Albra] text-sm text-gray-900">{item.title}</p>
                                    <p className="font-[ABC] text-xs text-gray-500 mt-0.5">{item.price}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Redirect overlay — AnimatePresence */}
            <AnimatePresence mode="wait">
                {selectedPackageOption && (
                    <motion.div
                        key="redirect-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/80 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="text-center px-8 py-10 rounded-2xl bg-white shadow-2xl max-w-sm"
                        >
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                className="w-12 h-12 border-2 border-amber-200 border-t-amber-500 rounded-full mx-auto mb-6"
                            />
                            <p className="font-[Albra] text-xl text-gray-900 mb-2">Redirecting to checkout</p>
                            <p className="font-[ABC] text-sm text-gray-500">
                                {selectedPackageOption.name} — {selectedPackageOption.price}
                            </p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Packages;
