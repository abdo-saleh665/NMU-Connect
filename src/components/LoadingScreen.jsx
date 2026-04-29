import { useEffect, useState } from "react";
import { useDarkMode } from '../context/DarkModeContext';

const LoadingScreen = ({ onComplete }) => {
  const [fade, setFade] = useState(false);
  const { isDark } = useDarkMode();

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFade(true), 1000);
    const doneTimer = setTimeout(() => onComplete?.(), 1300);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
    };
  }, [onComplete]);

  // In light mode: red + black | In dark mode: red + white
  const bottomNodeClass = isDark ? "node-white" : "node-black";
  const bottomConnectionClass = isDark ? "connection-white" : "connection-black";

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center
        bg-surface-light dark:bg-black transition-opacity duration-500
        ${fade ? "opacity-0" : "opacity-100"}`}
    >
      <svg viewBox="0 0 100 100" className="w-44 h-44">
        <defs>
          {/* Website Primary Red Gradient */}
          <linearGradient id="loadRedNeon" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#C4343D" />
            <stop offset="40%" stopColor="#A31D2B" />
            <stop offset="100%" stopColor="#7A1520" />
          </linearGradient>

          {/* White gradient (only visible in dark mode) */}
          <linearGradient id="loadWhiteGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#E0E0E0" />
          </linearGradient>

          {/* Black gradient (only visible in light mode) */}
          <linearGradient id="loadBlackGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2a2a2a" />
            <stop offset="100%" stopColor="#1a1a1a" />
          </linearGradient>

          {/* Strong Glow */}
          <filter id="loadGlow" x="-200%" y="-200%" width="400%" height="400%">
            <feGaussianBlur stdDeviation="2.8" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Soft Glow */}
          <filter id="loadSoftGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="1.5" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ===== CAP NETWORK - RED ===== */}
        <path d="M50 12L18 28L50 44L82 28Z" className="connection c1" fill="none" />
        <path d="M50 12L34 20L18 28" className="connection c2" fill="none" opacity="0.6" />
        <path d="M50 12L66 20L82 28" className="connection c3" fill="none" opacity="0.6" />
        <path d="M18 28L34 36L50 44" className="connection c4" fill="none" opacity="0.5" />
        <path d="M82 28L66 36L50 44" className="connection c5" fill="none" opacity="0.5" />

        {/* Cross connections */}
        <path d="M34 20L66 20" className="connection c6" fill="none" opacity="0.3" />
        <path d="M34 36L66 36" className="connection c7" fill="none" opacity="0.3" />

        {/* ===== MAIN NODES - RED ===== */}
        <circle cx="50" cy="12" r="3" className="node n0" />
        <circle cx="18" cy="28" r="2.5" className="node n1" />
        <circle cx="82" cy="28" r="2.5" className="node n2" />
        <circle cx="50" cy="44" r="3" className="node n3" />

        {/* ===== SECONDARY NODES - RED ===== */}
        <circle cx="34" cy="20" r="2" className="node n4" />
        <circle cx="66" cy="20" r="2" className="node n5" />
        <circle cx="34" cy="36" r="2" className="node n6" />
        <circle cx="66" cy="36" r="2" className="node n7" />

        {/* ===== CENTER NODE ===== */}
        <circle cx="50" cy="28" r="1.5" className="node n8" style={{ opacity: 0.5 }} />

        {/* ===== BOTTOM SECTION - BLACK in light mode, WHITE in dark mode ===== */}
        <path d="M35 54L50 44L65 54L50 64Z" className={`${bottomConnectionClass} cw1`} fill="none" />
        <path d="M35 54L50 64" className={`${bottomConnectionClass} cw2`} fill="none" opacity="0.6" />
        <path d="M65 54L50 64" className={`${bottomConnectionClass} cw3`} fill="none" opacity="0.6" />

        {/* Bottom nodes */}
        <circle cx="35" cy="54" r="2.2" className={`${bottomNodeClass} nw0`} />
        <circle cx="65" cy="54" r="2.2" className={`${bottomNodeClass} nw1`} />
        <circle cx="50" cy="44" r="2.2" className={`${bottomNodeClass} nw2`} />
        <circle cx="50" cy="64" r="2.5" className={`${bottomNodeClass} nw3`} />
        <circle cx="42" cy="49" r="1.5" className={`${bottomNodeClass} nw4`} style={{ opacity: 0.7 }} />
        <circle cx="58" cy="49" r="1.5" className={`${bottomNodeClass} nw5`} style={{ opacity: 0.7 }} />

        {/* ===== TASSEL - FAR LEFT ===== */}
        <path d="M22 12L22 38" className="tassel-line t1" />
        <circle cx="22" cy="18" r="1.6" className="data-pulse" />
        <circle cx="22" cy="38" r="2.2" className="node nt0" />

        {/* Tassel strands */}
        <path d="M22 38L16 58" className="tassel-line t2" />
        <path d="M22 38L22 60" className="tassel-line t3" />
        <path d="M22 38L28 58" className="tassel-line t4" />

        {/* Tassel end nodes */}
        <circle cx="16" cy="58" r="1.8" className="node nt1" />
        <circle cx="22" cy="60" r="2.2" className="node nt2" />
        <circle cx="28" cy="58" r="1.8" className="node nt3" />

        <style>{`
          .node {
            fill: url(#loadRedNeon);
            filter: url(#loadGlow);
            opacity: 0;
            animation: nodeIn .4s ease-out forwards, pulse 2.2s ease-in-out .8s infinite;
          }

          .n0 { animation-delay: 0s, .8s }
          .n1 { animation-delay: .08s, .88s }
          .n2 { animation-delay: .12s, .92s }
          .n3 { animation-delay: .16s, .96s }
          .n4 { animation-delay: .2s, 1s }
          .n5 { animation-delay: .24s, 1.04s }
          .n6 { animation-delay: .28s, 1.08s }
          .n7 { animation-delay: .32s, 1.12s }
          .n8 { animation-delay: .36s, 1.16s }
          .nt0 { animation-delay: .5s, 1.3s }
          .nt1 { animation-delay: .6s, 1.4s }
          .nt2 { animation-delay: .65s, 1.45s }
          .nt3 { animation-delay: .7s, 1.5s }

          .node-white {
            fill: url(#loadWhiteGrad);
            filter: url(#loadSoftGlow);
            opacity: 0;
            animation: nodeIn .4s ease-out forwards, pulseWhite 2.2s ease-in-out .8s infinite;
          }

          .nw0 { animation-delay: .4s, 1.2s }
          .nw1 { animation-delay: .44s, 1.24s }
          .nw2 { animation-delay: .48s, 1.28s }
          .nw3 { animation-delay: .52s, 1.32s }
          .nw4 { animation-delay: .56s, 1.36s }
          .nw5 { animation-delay: .6s, 1.4s }

          @keyframes nodeIn {
            to { opacity: 1 }
          }

          @keyframes pulse {
            0%,100% { opacity: 0.7; transform: scale(0.95); }
            50% { opacity: 1; transform: scale(1.1); }
          }

          @keyframes pulseWhite {
            0%,100% { opacity: 0.8; transform: scale(0.95); }
            50% { opacity: 1; transform: scale(1.08); }
          }

          @keyframes pulseBlack {
            0%,100% { opacity: 0.8; transform: scale(0.95); }
            50% { opacity: 1; transform: scale(1.08); }
          }

          .node-black {
            fill: url(#loadBlackGrad);
            filter: url(#loadSoftGlow);
            opacity: 0;
            animation: nodeIn .4s ease-out forwards, pulseBlack 2.2s ease-in-out .8s infinite;
          }

          .connection-black {
            stroke: url(#loadBlackGrad);
            stroke-width: 1.2;
            stroke-linecap: round;
            stroke-dasharray: 60;
            stroke-dashoffset: 60;
            animation: draw .5s ease-out forwards, flowBlack 3s linear .8s infinite;
          }

          @keyframes flowBlack {
            to { stroke-dashoffset: -18 }
          }

          .connection {
            stroke: url(#loadRedNeon);
            stroke-width: 1.4;
            stroke-linecap: round;
            stroke-dasharray: 80;
            stroke-dashoffset: 80;
            animation: draw .6s ease-out forwards, flow 3s linear .8s infinite;
          }

          .c1 { animation-delay: .1s, .9s }
          .c2 { animation-delay: .15s, .95s }
          .c3 { animation-delay: .2s, 1s }
          .c4 { animation-delay: .25s, 1.05s }
          .c5 { animation-delay: .3s, 1.1s }
          .c6 { animation-delay: .35s, 1.15s }
          .c7 { animation-delay: .4s, 1.2s }
          .c8 { animation-delay: .45s, 1.25s }
          .c9 { animation-delay: .5s, 1.3s }
          .c10 { animation-delay: .55s, 1.35s }

          .connection-white {
            stroke: url(#loadWhiteGrad);
            stroke-width: 1.2;
            stroke-linecap: round;
            stroke-dasharray: 60;
            stroke-dashoffset: 60;
            animation: draw .5s ease-out forwards, flowWhite 3s linear .8s infinite;
          }

          .cw1 { animation-delay: .45s, 1.25s }
          .cw2 { animation-delay: .5s, 1.3s }
          .cw3 { animation-delay: .55s, 1.35s }

          .tassel-line {
            stroke: url(#loadRedNeon);
            stroke-width: 1.3;
            stroke-linecap: round;
            stroke-dasharray: 50;
            stroke-dashoffset: 50;
            animation: draw .5s ease-out forwards;
          }

          .t1 { animation-delay: .4s }
          .t2 { animation-delay: .55s }
          .t3 { animation-delay: .6s }
          .t4 { animation-delay: .65s }

          @keyframes draw {
            to { stroke-dashoffset: 0 }
          }

          @keyframes flow {
            to { stroke-dashoffset: -22 }
          }

          @keyframes flowWhite {
            to { stroke-dashoffset: -18 }
          }

          .outer-ring {
            stroke: url(#loadRedNeon);
            stroke-width: 0.5;
            opacity: 0;
            animation: ringIn .5s ease-out forwards, ringPulse 3s ease-in-out .8s infinite;
          }

          .ring2 { animation-delay: .2s, 1s }

          @keyframes ringIn {
            to { opacity: 0.2 }
          }

          @keyframes ringPulse {
            0%,100% { opacity: 0.15 }
            50% { opacity: 0.3 }
          }

          .data-pulse {
            fill: #FFD1D1;
            filter: url(#loadGlow);
            opacity: 0;
            animation: pulseIn .3s ease-out .5s forwards, dataMove 1.6s ease-in-out 1s infinite;
          }

          @keyframes pulseIn {
            to { opacity: 1 }
          }

          @keyframes dataMove {
            0% { transform: translateY(0); opacity: 1 }
            100% { transform: translateY(20px); opacity: 0 }
          }
        `}</style>
      </svg>

      {/* NMU Connect Text */}
      <div className="mt-6 text-center animate-fadeIn">
        <h1 className="text-2xl font-bold text-[#1b0e0e] dark:text-white tracking-wide">
          NMU <span className="text-primary">Connect</span>
        </h1>
        <p className="text-sm text-[#5c4545] dark:text-[#d0c0c0] mt-1">
          New Mansoura University
        </p>
      </div>

      {/* Loading Progress Bar */}
      <div className="mt-8 w-48">
        <div className="h-1 bg-[#e7d0d1] dark:bg-[#3a2a2a] rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-primary to-primary-hover rounded-full animate-loadingBar"></div>
        </div>
        <p className="text-xs text-[#994d51] text-center mt-2 animate-pulse">Loading...</p>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out 0.3s forwards;
          opacity: 0;
        }
        @keyframes loadingBar {
          0% { width: 0%; }
          50% { width: 70%; }
          100% { width: 100%; }
        }
        .animate-loadingBar {
          animation: loadingBar 1.2s ease-in-out forwards;
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;
