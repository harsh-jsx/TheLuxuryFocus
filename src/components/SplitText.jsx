import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

/**
 * SplitText Utility Component
 * Splits text into lines, words, and chars for granular animation control.
 * uses GSAP for any internal setup if needed, but primarily prepares the DOM.
 */
const SplitText = ({ children, className, style, delay = 0 }) => {
    const containerRef = useRef(null);
    const wordsRef = useRef([]);

    useGSAP(() => {
        // Simple entry animation example
        // In a real "Awwwards" site, you might want the parent to control this timeline.
        // For now, let's just make it reveal itself nicely if no external control is applied.

        // Clear any previous animations
        gsap.set(wordsRef.current, { y: 20, opacity: 0 });

        gsap.to(wordsRef.current, {
            y: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.02,
            ease: "power4.out",
            delay: delay,
        });
    }, { scope: containerRef });

    if (typeof children !== 'string') {
        return <div className={className} style={style}>{children}</div>;
    }

    const words = children.split(' ');

    return (
        <div ref={containerRef} className={`split-text-container ${className}`} style={{ ...style, overflow: 'hidden', display: 'flex', flexWrap: 'wrap', gap: '0.25em' }}>
            {words.map((word, i) => (
                <span
                    key={i}
                    ref={el => wordsRef.current[i] = el}
                    className="split-word inline-block will-change-transform"
                >
                    {word}&nbsp;
                </span>
            ))}
        </div>
    );
};

export default SplitText;
