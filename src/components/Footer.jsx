import React, { useEffect, useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import SplitText from "./SplitText";

const TICKER_ITEMS = [
  "The Luxury Focus",
  "Editorial Excellence",
  "Curated Living",
  "Est. 2020",
  "Luxury Redefined",
  "India — Global",
];

const NAV_COLUMNS = [
  {
    label: "Explore",
    links: [
      { text: "Home", href: "/" },
      { text: "Packages", href: "/packages" },
      { text: "About", href: "/about" },
      { text: "Stores", href: "/stores" },
      { text: "Categories", href: "/categories" },
      { text: "Dashboard", href: "/dashboard" },
    ],
  },

  {
    label: "Legal",
    links: [
      { text: "Privacy Policy", href: "/privacy" },
      { text: "Terms of Use", href: "/terms" },
      { text: "Cookie Policy", href: "/cookies" },
      { text: "Disclaimer", href: "/disclaimer" },
      { text: "Refund Policy", href: "/refund" },
      { text: "Sitemap", href: "/sitemap" },
    ],
  },
];

const SOCIALS = [
  { text: "Instagram", href: "https://www.instagram.com/raamilpandya" },
  { text: "YouTube", href: "https://www.youtube.com/@ramilramu" },
  { text: "X / Twitter", href: "https://x.com/ramilramu" },
  { text: "Facebook", href: "https://www.facebook.com/ramilramu" },
  { text: "Pinterest", href: "https://www.pinterest.com/ramilramu" },
];

const Footer = () => {
  const tickerRef = useRef(null);

  return (
    <footer
      style={{
        background: "#0A0A0A",
        color: "#E4E0D9",
        fontFamily: "'ABC', sans-serif",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* ── Ticker ── */}
      <div
        style={{
          borderTop: "0.5px solid rgba(228,224,217,0.12)",
          borderBottom: "0.5px solid rgba(228,224,217,0.12)",
          padding: "14px 0",
          overflow: "hidden",
          whiteSpace: "nowrap",
        }}
      >
        <div
          ref={tickerRef}
          style={{
            display: "inline-flex",
            gap: "48px",
            animation: "tlf-ticker 22s linear infinite",
          }}
        >
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span
              key={i}
              style={{
                fontSize: "10px",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                opacity: 0.35,
                display: "inline-flex",
                alignItems: "center",
                gap: "20px",
              }}
            >
              {item}
              <span
                style={{
                  width: "3px",
                  height: "3px",
                  borderRadius: "50%",
                  background: "#D0B887",
                  opacity: 0.6,
                  display: "inline-block",
                }}
              />
            </span>
          ))}
        </div>
      </div>

      {/* ── CTA Section ── */}
      <div
        style={{
          padding: "80px 48px 72px",
          borderBottom: "0.5px solid rgba(228,224,217,0.1)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          gap: "32px",
          flexWrap: "wrap",
        }}
      >
        {/* Headline */}
        <div
          style={{
            fontFamily: "'Albra', 'Georgia', serif",
            fontSize: "clamp(52px, 7vw, 96px)",
            fontWeight: 300,
            lineHeight: 0.92,
            letterSpacing: "-0.02em",
            maxWidth: "700px",
          }}
        >
          <SplitText animationType="spring">Let's create</SplitText>
          <SplitText
            animationType="spring"
            style={{ color: "#D0B887", fontStyle: "italic" }}
          >
            something new.
          </SplitText>
        </div>

        {/* CTA Right */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: "24px",
          }}
        >
          <p
            style={{
              fontSize: "11px",
              letterSpacing: "0.08em",
              opacity: 0.4,
              textAlign: "right",
              maxWidth: "200px",
              lineHeight: 1.7,
              textTransform: "uppercase",
              margin: 0,
            }}
          >
            Ready to make your business accessible to everyone?
            <br />
            We'd love to hear about your vision.
          </p>
          <a
            href="/packages"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              border: "0.5px solid rgba(228,224,217,0.25)",
              borderRadius: "100px",
              padding: "14px 28px",
              fontSize: "10px",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              background: "transparent",
              color: "#E4E0D9",
              textDecoration: "none",
              transition: "background 0.3s, border-color 0.3s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(228,224,217,0.07)";
              e.currentTarget.style.borderColor = "rgba(228,224,217,0.45)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.borderColor = "rgba(228,224,217,0.25)";
            }}
          >
            Get your business featured
            <ArrowUpRight size={11} opacity={0.6} />
          </a>
        </div>
      </div>

      {/* ── Nav Grid ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr 1fr 1fr",
          borderBottom: "0.5px solid rgba(228,224,217,0.1)",
        }}
      >
        {/* Brand column */}
        <div
          style={{
            padding: "48px",
            borderRight: "0.5px solid rgba(228,224,217,0.1)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            gap: "40px",
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "'Albra', 'Georgia', serif",
                fontSize: "52px",
                fontWeight: 300,
                letterSpacing: "-0.02em",
                lineHeight: 1,
              }}
            >
              TLF
            </div>
            <div
              style={{
                fontSize: "9px",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                opacity: 0.28,
                marginTop: "8px",
              }}
            >
              The Luxury Focus
            </div>
          </div>

          <div>
            <div
              style={{
                fontSize: "9px",
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                opacity: 0.3,
                marginBottom: "20px",
              }}
            >
              Follow Us
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              {SOCIALS.map(({ text, href }) => (
                <a
                  key={text}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: "13px",
                    color: "#E4E0D9",
                    textDecoration: "none",
                    opacity: 0.55,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    transition: "opacity 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = 1)}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = 0.55)}
                >
                  {text}
                  <ArrowUpRight size={10} opacity={0.4} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Nav columns */}
        {NAV_COLUMNS.map(({ label, links }, colIdx) => (
          <div
            key={label}
            style={{
              padding: "48px",
              borderRight:
                colIdx < NAV_COLUMNS.length - 1
                  ? "0.5px solid rgba(228,224,217,0.1)"
                  : "none",
            }}
          >
            <div
              style={{
                fontSize: "9px",
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                opacity: 0.3,
                marginBottom: "28px",
              }}
            >
              {label}
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "13px" }}
            >
              {links.map(({ text, href }) => (
                <a
                  key={text}
                  href={href}
                  style={{
                    fontSize: "13px",
                    color: "#E4E0D9",
                    textDecoration: "none",
                    opacity: 0.6,
                    letterSpacing: "0.02em",
                    transition: "opacity 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = 1)}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = 0.6)}
                >
                  {text}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ── Bottom Bar ── */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "22px 48px",
          gap: "24px",
          flexWrap: "wrap",
        }}
      >
        {/* Left */}
        <div style={{ display: "flex", alignItems: "center", gap: "28px" }}>
          <span
            style={{
              fontSize: "10px",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              opacity: 0.25,
            }}
          >
            © 2026 The Luxury Focus
          </span>
          <div
            style={{
              width: "1px",
              height: "28px",
              background: "rgba(228,224,217,0.1)",
            }}
          />
          {[
            { text: "Privacy", href: "/privacy" },
            { text: "Terms", href: "/terms" },
            { text: "Cookies", href: "/cookies" },
          ].map(({ text, href }) => (
            <a
              key={text}
              href={href}
              style={{
                fontSize: "10px",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                opacity: 0.3,
                color: "#E4E0D9",
                textDecoration: "none",
                transition: "opacity 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = 0.7)}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = 0.3)}
            >
              {text}
            </a>
          ))}
        </div>

        {/* Center */}
        <span
          style={{
            fontSize: "10px",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            opacity: 0.18,
          }}
        >
          All rights reserved
        </span>

        {/* Right */}
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          {/* 403Labs badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              border: "0.5px solid rgba(208,184,135,0.25)",
              borderRadius: "4px",
              padding: "8px 14px",
            }}
          >
            <span style={{ color: "#D0B887", fontSize: "12px" }}>✦</span>
            <div
              style={{
                fontSize: "9px",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                opacity: 0.5,
                lineHeight: 1.5,
              }}
            >
              Made with care by{" "}
              <a
                href="https://403labs.in"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#E4E0D9",
                  textDecoration: "none",
                  opacity: 1,
                }}
              >
                403Labs
              </a>
            </div>
          </div>

          <div
            style={{
              width: "1px",
              height: "28px",
              background: "rgba(228,224,217,0.1)",
            }}
          />

          <span
            style={{
              fontSize: "10px",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              opacity: 0.22,
            }}
          >
            Designed by Harsh
          </span>
        </div>
      </div>

      {/* ── Ticker keyframe injected globally once ── */}
      <style>{`
        @keyframes tlf-ticker {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
