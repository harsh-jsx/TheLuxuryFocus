import { collection, addDoc, getDocs, deleteDoc } from 'firebase/firestore';
import { db } from './firebase';

const blogsStartData = [
    {
        title: "The Future of Luxury Living",
        category: "Real Estate",
        date: "Oct 12, 2025",
        image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800",
        excerpt: "Discover how technology and sustainable design are reshaping the landscape of modern luxury homes.",
        content: "<p>The landscape of luxury living is undergoing a profound transformation. As we move deeper into the 21st century, the definition of a high-end home is evolving from mere size and price to a focus on technological integration, sustainability, and personal well-being.</p><h2>Smart Home Evolution</h2><p>Today's smart homes are not just about voice-controlled lights. They are ecosystems designed to optimize energy, security, and comfort seamlessly. Imagine a home that adjusts its temperature based on your circadian rhythm or windows that tint automatically to minimize heat gain while preserving spectacular views.</p><h2>Sustainability as a Standard</h2><p>True luxury now includes environmental responsibility. Solar integration, geothermal heating, and greywater recycling systems are becoming standard features in premium developments. These aren't just eco-friendly; they represent the pinnacle of engineering and design.</p>",
        author: "Sarah Mitchell",
        readingTime: "6 min"
    },
    {
        title: "Top 10 Amenities for 2025",
        category: "Lifestyle",
        date: "Sep 28, 2025",
        image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800",
        excerpt: "From private wellness centers to smart home integration, explore the must-have amenities for the coming year.",
        content: "<p>What separates a premium property from a truly exceptional one? The answer often lies in the amenities. For 2025, we are seeing a shift towards personalized, wellness-focused features that cater to every aspect of a resident's life.</p><h2>1. Private Recovery Suites</h2><p>Beyond the standard home gym, the new must-have is the recovery suite. This includes cryotherapy chambers, infrared saunas, and compression therapy zones.</p><h2>2. Hybrid Social Spaces</h2><p>As remote work becomes more permanent, luxury buildings are creating spaces that transition from high-tech coworking hubs during the day to sophisticated cocktail lounges at night.</p>",
        author: "James Wilson",
        readingTime: "8 min"
    },
    {
        title: "Investing in Premium Properties",
        category: "Investment",
        date: "Sep 15, 2025",
        image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=800",
        excerpt: "Expert insights on why premium real estate remains a solid investment strategy in a fluctuating market.",
        content: "<p>In an era of economic volatility, where should savvy investors place their capital? Historically, premium real estate has proven to be one of the most resilient asset classes. Here's why the luxury sector continues to outperform traditional markets.</p><h2>Limited Supply, Infinite Demand</h2><p>The cardinal rule of luxury real estate is scarcity. There are only so many properties on the waterfront of Dubai or in the historic heart of London. This inherent limitation creates a natural price floor and ensures long-term appreciation.</p><h2>Quality over Quantity</h2><p>In a downturn, lower-end properties are hit first. Premium assets, built with superior materials and situated in prime locations, tend to hold their value because the buyer pool is more financially resilient.</p>",
        author: "Marcus Chen",
        readingTime: "5 min"
    }
];

export const seedBlogs = async () => {
    try {
        const blogsCol = collection(db, 'blogs');

        // Checking if already seeded to avoid duplicates (optional, but safer)
        const snapshot = await getDocs(blogsCol);
        if (snapshot.size > 0) {
            console.log("Blogs already seeded.");
            return;
        }

        for (const blog of blogsStartData) {
            await addDoc(blogsCol, blog);
        }
        console.log("Successfully seeded blogs!");
    } catch (error) {
        console.error("Error seeding blogs: ", error);
    }
};

// Function to clear blogs if needed
export const clearBlogs = async () => {
    try {
        const blogsCol = collection(db, 'blogs');
        const snapshot = await getDocs(blogsCol);
        const deletePromises = snapshot.docs.map(document => deleteDoc(doc(db, 'blogs', document.id)));
        await Promise.all(deletePromises);
        console.log("Successfully cleared blogs!");
    } catch (error) {
        console.error("Error clearing blogs: ", error);
    }
}
