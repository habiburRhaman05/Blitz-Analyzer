// "use client";

// import { useTheme } from "next-themes";
// import React, { useEffect, useState } from "react";
// import Image from "next/image";

// const DashboardView = () => {
//   const { theme } = useTheme();
//   const [mounted, setMounted] = useState(false);

//   // Avoid hydration mismatch by waiting for mount
//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   if (!mounted) return null;

//   const isDark = theme === "dark";

//   const images = {
//     dark: "https://res.cloudinary.com/drngnsgwy/image/upload/blitz-analyzer/images/dashboard-dark.png",
//     light: "https://res.cloudinary.com/drngnsgwy/image/upload/blitz-analyzer/images/dashboard-light.png",
//   };

//   return (
//     <div className="flex justify-center items-center p-6 md:p-16 bg-gray-50 dark:bg-[#0b0b0b] transition-colors duration-300">
//       {/* Main Window Container */}
//       <div
//         className={`w-full max-w-[950px] rounded-xl overflow-hidden border transition-all duration-500
//           ${
//             isDark
//               ? "bg-[#1e1e1e] border-white/10 shadow-[0_30px_60px_-12px_rgba(0,0,0,0.6)]"
//               : "bg-white border-black/10 shadow-[0_30px_60px_-12px_rgba(0,0,0,0.25),0_0_0_0.5px_rgba(0,0,0,0.1)]"
//           }`}
//       >
//         {/* macOS Title Bar */}
//         <div
//           className={`h-11 flex items-center justify-between px-4 relative z-10 border-b transition-colors duration-300
//             ${
//               isDark
//                 ? "bg-gradient-to-b from-[#333333] to-[#252525] border-black/40"
//                 : "bg-gradient-to-b from-[#f8f8f8] to-[#ebebeb] border-gray-300"
//             }`}
//         >
//           {/* Left: Traffic Lights */}
//           <div className="flex gap-2 w-[60px]">
//             <div className="w-3 h-3 rounded-full bg-[#ff5f56] border-[0.5px] border-black/10 shadow-inner"></div>
//             <div className="w-3 h-3 rounded-full bg-[#ffbd2e] border-[0.5px] border-black/10 shadow-inner"></div>
//             <div className="w-3 h-3 rounded-full bg-[#27c93f] border-[0.5px] border-black/10 shadow-inner"></div>
//           </div>

//           {/* Center: Address Bar */}
//           <div
//             className={`absolute left-1/2 -translate-x-1/2 w-1/2 h-7 rounded-md flex items-center justify-center text-[11px] border transition-all duration-300
//               ${
//                 isDark
//                   ? "bg-white/5 border-white/10 text-gray-400"
//                   : "bg-white border-gray-200 text-gray-500 shadow-sm"
//               }`}
//           >
//             <span className="mr-1.5 opacity-60">🔒</span>
//             <span className="tracking-wide">www.blitz-analyzer.com</span>
//           </div>

//           {/* Right: Functional Icons */}
//           <div className="flex gap-4 w-[60px] justify-end text-gray-400 dark:text-gray-500 font-light">
//             <span className="cursor-default text-sm">⇪</span>
//             <span className="cursor-default text-lg">+</span>
//             <span className="cursor-default text-sm">❐</span>
//           </div>
//         </div>

//         {/* Browser Content Area */}
//         <div className="relative aspect-video w-full overflow-y-auto bg-white dark:bg-[#121212]">
//           <img
//             src={isDark ? images.dark : images.light}
//             alt="Blitz Analyzer Dashboard"
//             className="w-full h-auto block"
//             loading="lazy"
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DashboardView;


"use client";

import { useTheme } from "next-themes";
import React, { useEffect, useState } from "react";

const DashboardView = () => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Sync hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = theme === "dark";

  const images = {
    dark: "https://res.cloudinary.com/drngnsgwy/image/upload/blitz-analyzer/images/Blitz_Analyzer_-_Shine_Your_Resume_-_Brave_3_26_2026_4_52_17_PM_vqvyhs.png",
    light: "https://res.cloudinary.com/drngnsgwy/image/upload/blitz-analyzer/images/dashboard-light.png",
  };

  return (
    /* Removed padding and background to blend with HeroSection */
    <div className="flex justify-center items-center w-full bg-transparent transition-colors duration-300">
      
      {/* Main Window Container */}
      <div
        className={`w-full max-w-[950px] rounded-xl overflow-hidden border transition-all duration-500
          ${
            isDark
              ? "bg-[#0a0a0a] border-white/10 shadow-[0_40px_100px_-12px_rgba(0,0,0,0.7)]"
              : "bg-white border-black/10 shadow-[0_30px_60px_-12px_rgba(0,0,0,0.2),0_0_0_0.5px_rgba(0,0,0,0.05)]"
          }`}
      >
        {/* macOS Title Bar */}
        <div
          className={`h-11 flex items-center justify-between px-4 relative z-10 border-b transition-colors duration-300
            ${
              isDark
                ? "bg-gradient-to-b from-[#2a2a2a] to-[#1a1a1a] border-black/60"
                : "bg-gradient-to-b from-[#f8f8f8] to-[#ebebeb] border-gray-300"
            }`}
        >
          {/* Left: Traffic Lights */}
          <div className="flex gap-2 w-[60px]">
            <div className="w-3.5 h-3.5 rounded-full bg-[#ff5f56] border-[0.5px] border-black/10 shadow-inner"></div>
            <div className="w-3.5 h-3.5 rounded-full bg-[#ffbd2e] border-[0.5px] border-black/10 shadow-inner"></div>
            <div className="w-3.5 h-3.5 rounded-full bg-[#27c93f] border-[0.5px] border-black/10 shadow-inner"></div>
          </div>

          {/* Center: Address Bar */}
          <div
            className={`absolute left-1/2 -translate-x-1/2 w-1/2 h-7 rounded-md flex items-center justify-center text-[11px] border transition-all duration-300
              ${
                isDark
                  ? "bg-white/5 border-white/5 text-gray-400"
                  : "bg-white border-gray-200 text-gray-500 shadow-sm"
              }`}
          >
            <span className="mr-2 opacity-50">🔒</span>
            <span className="tracking-wide font-medium">www.blitz-analyzer.com</span>
          </div>

          {/* Right: Functional Icons */}
          <div className="flex gap-4 w-[60px] justify-end text-gray-400 dark:text-gray-500 font-light">
            <span className="cursor-default text-sm">⇪</span>
            <span className="cursor-default text-lg">+</span>
            <span className="cursor-default text-sm">❐</span>
          </div>
        </div>

        {/* Browser Content Area */}
        <div className={`relative aspect-video w-full overflow-y-auto transition-colors duration-300 ${
          isDark ? "bg-[#050505]" : "bg-white"
        }`}>
          <img
            src={isDark ? images.dark : images.light}
            alt="Blitz Analyzer Dashboard"
            className="w-full h-auto block"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardView;