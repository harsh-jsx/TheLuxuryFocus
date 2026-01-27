import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const SplitText = ({ children, className, style, delay = 0, type = "words" }) => {
    const elRef = useRef(null);

    useGSAP(() => {
        const el = elRef.current;
        if (!el) return;

        // Reset
        gsap.set(el, { autoAlpha: 1 });

        const q = gsap.utils.selector(el);
        const elements = q(type === "chars" ? ".char" : ".word");

        gsap.set(elements, {
            y: "100%",
            opacity: 0,
            rotateX: -90
        });

        gsap.to(elements, {
            y: "0%",
            opacity: 1,
            rotateX: 0,
            duration: 1.2,
            stagger: 0.02,
            ease: "power4.out",
            delay: delay
        });

    }, { scope: elRef, dependencies: [delay, type] });

    if (typeof children !== 'string') {
        return <div className={className} style={style}>{children}</div>;
    }

    const renderWords = () => {
        return children.split(' ').map((word, i) => (
            <div key={i} className="inline-block overflow-hidden align-top mr-[0.25em] pb-1">
                <span className="word inline-block transform-style-3d origin-bottom">
                    {word}
                </span>
            </div>
        ));
    };

    return (
        <div ref={elRef} className={`${className} leading-tight`} style={{ ...style, perspective: '1000px' }}>
            {renderWords()}
        </div>
    );
};

export default SplitText;
