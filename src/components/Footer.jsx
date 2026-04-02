import React from "react";
import { ArrowUpRight } from "lucide-react";
import SplitText from "./SplitText";

const Footer = () => {
  return (
    <footer className="bg-black text-[#E4E0D9] pt-32 pb-12 px-4 md:px-12 relative overflow-hidden">
      {/* Large CTA */}
      <div className="max-w-7xl mx-auto flex flex-col items-center text-center border-b border-white/10 pb-32">
        <div className="font-[Albra] text-6xl md:text-9xl">
          <SplitText animationType="spring">Let's create</SplitText>
          <SplitText animationType="spring" className="text-[#D0B887] italic">
            something new.
          </SplitText>
        </div>
        <button className="mt-12 px-8 py-4 bg-white text-black font-[ABC] text-sm uppercase tracking-widest rounded-full hover:scale-105 transition-transform duration-300">
          Get in Touch
        </button>
      </div>

      {/* Links */}
      <div className="max-w-7xl mx-auto mt-20 flex flex-col md:flex-row justify-between items-start md:items-end gap-12">
        <div className="flex flex-col gap-8">
          <SplitText className="font-[Albra] text-4xl">TLF</SplitText>
          <div className="flex gap-6">
            {["Instagram", "Youtube", "X", "Facebook", "Pin.it"].map(
              (social) => (
                <a
                  href={
                    social.toLowerCase() === "instagram"
                      ? "https://www.instagram.com/raamilpandya"
                      : social.toLowerCase() === "youtube"
                        ? "https://www.youtube.com/@ramilramu"
                        : social.toLowerCase() === "x"
                          ? "https://x.com/ramilramu"
                          : social.toLowerCase() === "facebook"
                            ? "https://www.facebook.com/ramilramu"
                            : social.toLowerCase() === "pin.it"
                              ? "https://www.pinterest.com/ramilramu"
                              : ""
                  }
                  key={social}
                  className="font-[ABC] text-xs uppercase tracking-widest hover:text-[#2D45FF] transition-colors"
                >
                  {social}
                </a>
              ),
            )}
          </div>
        </div>
        <div className="flex flex-col md:items-end gap-2 hover:scale-105 transition-transform duration-300">
          <span>
            Made with ❤️ by tech partner{" "}
            <a
              href="https://403labs.in"
              className="hover:text-[#2D45FF] transition-colors"
            >
              403Labs
            </a>
          </span>
        </div>

        <div className="flex flex-col md:items-end gap-2">
          <span className="font-[ABC] text-xs opacity-40">
            © 2026 The Luxury Focus. All rights reserved.
          </span>
          <span className="font-[ABC] text-xs opacity-40">
            Designed by Harsh
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
