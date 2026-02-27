import React, { useRef } from "react";
import { UserPlus, Link2, TrendingUp } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TiltedCard from "./TiltedCard";
import SplitText from "./SplitText";

gsap.registerPlugin(ScrollTrigger);

const stepsData = [
    {
        icon: UserPlus,
        number: "01",
        title: "Create Profile",
        desc: "Set up your business profile and get discovered by the right audience."
    },
    {
        icon: Link2,
        number: "02",
        title: "Connect & Engage",
        desc: "Interact with customers and build trust through meaningful engagement."
    },
    {
        icon: TrendingUp,
        number: "03",
        title: "Scale & Grow",
        desc: "Use insights and analytics to optimize and scale your performance."
    }
];

const HowItWorks = () => {
    const containerRef = useRef(null);
    const cardsRef = useRef([]);

    useGSAP(() => {
        const ctx = gsap.context(() => {
            gsap.from(cardsRef.current, {
                y: 60,
                opacity: 0,
                duration: 1,
                stagger: 0.2,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 80%",
                    once: true
                }
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={containerRef}
            className="py-2 bg-white"
        >
            <div className="max-w-7xl mx-auto px-6 text-center">

                {/* Heading */}
                <SplitText className="text-4xl md:text-[10vw] font-[druk] leading-[.8] ">
                    How It Works
                </SplitText>

                <p className="text-black font-[neue] text-[18px] font-bold tracking-[0.02em] leading-[1.2] mb-20">
                    A seamless process designed to connect businesses and customers efficiently.
                </p>

                {/* Cards */}
                <div className="grid md:grid-cols-3 gap-10">

                    <TiltedCard
                        imageSrc="https://i.scdn.co/image/ab67616d0000b273d9985092cd88bffd97653b58"
                        altText="Kendrick Lamar - GNX Album Cover"
                        captionText="Kendrick Lamar - GNX"
                        containerHeight="300px"
                        containerWidth="300px"
                        imageHeight="300px"
                        imageWidth="300px"
                        rotateAmplitude={12}
                        scaleOnHover={1.05}
                        showMobileWarning={false}
                        showTooltip
                        displayOverlayContent
                        overlayContent={
                            <p className="tilted-card-demo-text">
                                Kendrick Lamar - GNX
                            </p>
                        }
                    />
                    <TiltedCard
                        imageSrc="https://i.scdn.co/image/ab67616d0000b273d9985092cd88bffd97653b58"
                        altText="Kendrick Lamar - GNX Album Cover"
                        captionText="Kendrick Lamar - GNX"
                        containerHeight="300px"
                        containerWidth="300px"
                        imageHeight="300px"
                        imageWidth="300px"
                        rotateAmplitude={12}
                        scaleOnHover={1.05}
                        showMobileWarning={false}
                        showTooltip
                        displayOverlayContent
                        overlayContent={
                            <p className="tilted-card-demo-text">
                                Kendrick Lamar - GNX
                            </p>
                        }
                    />
                    <TiltedCard
                        imageSrc="https://i.scdn.co/image/ab67616d0000b273d9985092cd88bffd97653b58"
                        altText="Kendrick Lamar - GNX Album Cover"
                        captionText="Kendrick Lamar - GNX"
                        containerHeight="300px"
                        containerWidth="300px"
                        imageHeight="300px"
                        imageWidth="300px"
                        rotateAmplitude={12}
                        scaleOnHover={1.05}
                        showMobileWarning={false}
                        showTooltip
                        displayOverlayContent
                        overlayContent={
                            <p className="tilted-card-demo-text">
                                Kendrick Lamar - GNX
                            </p>
                        }
                    />

                </div>

            </div>
        </section>
    );
};

export default HowItWorks;