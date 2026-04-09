import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const SplitText = ({
  children,
  className = "",
  style = {},
  delay = 0,
  type = "words",
  stagger = 0.04,
  animationType = "spring",
  scrollTrigger = true,
  once = true,
}) => {
  const elRef = useRef(null);
  const isTextLike =
    typeof children === "string" || typeof children === "number";

  useGSAP(() => {
    const el = elRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const elements = el.querySelectorAll(
        type === "chars" ? ".char" : ".word",
      );

      let fromVars = {};
      let toVars = {};

      switch (animationType) {
        case "spring":
          fromVars = {
            y: "120%",
            opacity: 0,
            rotateX: -60,
            transformOrigin: "bottom center",
          };
          toVars = {
            y: "0%",
            opacity: 1,
            rotateX: 0,
            ease: "back.out(1.4)",
            duration: 1.2,
          };
          break;

        case "fade":
          fromVars = { y: "20%", opacity: 0 };
          toVars = {
            y: "0%",
            opacity: 1,
            ease: "power3.out",
            duration: 1.2,
          };
          break;

        default:
          fromVars = { y: "110%", opacity: 0 };
          toVars = {
            y: "0%",
            opacity: 1,
            ease: "power4.out",
            duration: 1.2,
          };
      }

      if (!elements.length) {
        const wrapperFrom = { y: 20, opacity: 0 };
        const wrapperTo = {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          delay,
        };
        if (scrollTrigger) {
          gsap.fromTo(el, wrapperFrom, {
            ...wrapperTo,
            scrollTrigger: {
              trigger: el,
              start: "top 80%",
              once: once,
              invalidateOnRefresh: true,
            },
          });
        } else {
          gsap.fromTo(el, wrapperFrom, wrapperTo);
        }
        return;
      }

      if (scrollTrigger) {
        gsap.fromTo(elements, fromVars, {
          ...toVars,
          stagger,
          delay,
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
            once: once,
            invalidateOnRefresh: true,
          },
        });
      } else {
        gsap.fromTo(elements, fromVars, {
          ...toVars,
          stagger,
          delay,
        });
      }
    }, elRef);

    return () => ctx.revert();
  }, [children, delay, type, stagger, animationType, scrollTrigger, once]);

  if (!isTextLike) {
    return (
      <div
        ref={elRef}
        className={`${className} leading-tight`}
        style={{ ...style, perspective: "1000px" }}
      >
        {children}
      </div>
    );
  }

  const renderElements = () =>
    String(children)
      .trim()
      .split(/\s+/)
      .map((word, wordIndex) => (
        <div
          key={wordIndex}
          className="inline-block overflow-hidden align-top mr-[0.25em]"
        >
          {type === "chars" ? (
            word.split("").map((char, i) => (
              <span key={i} className="char inline-block">
                {char}
              </span>
            ))
          ) : (
            <span className="word inline-block">{word}</span>
          )}
        </div>
      ));

  return (
    <div
      ref={elRef}
      className={`${className} leading-tight`}
      style={{ ...style, perspective: "1000px" }}
    >
      {renderElements()}
    </div>
  );
};

export default SplitText;
