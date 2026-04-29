import { useEffect, useRef, useState } from "react";

const GraduationCapLogo = ({ size = "md", className = "" }) => {
    const sizes = { sm: 64, md: 96, lg: 160, xl: 224 };
    const dimension = sizes[size] || sizes.md;

    const rafRef = useRef(null);
    const [scrollOffset, setScrollOffset] = useState(0);
    const [hoverDir, setHoverDir] = useState(1);

    useEffect(() => {
        const onScroll = () => {
            if (rafRef.current) return;
            rafRef.current = requestAnimationFrame(() => {
                setScrollOffset(Math.min(window.scrollY * 0.025, 14));
                rafRef.current = null;
            });
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <svg
            width={dimension}
            height={dimension}
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            style={{ "--scroll": `${scrollOffset}px`, "--dir": hoverDir }}
            onMouseMove={(e) => {
                const { left, width } = e.currentTarget.getBoundingClientRect();
                setHoverDir(e.clientX < left + width / 2 ? -1 : 1);
            }}
        >
            <defs>
                {/* Premium Red Gradient */}
                <linearGradient id="redNeon" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FF6A6A" />
                    <stop offset="40%" stopColor="#E8474F" />
                    <stop offset="100%" stopColor="#7A1F28" />
                </linearGradient>

                {/* White gradient for contrast */}
                <linearGradient id="whiteGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFFFFF" />
                    <stop offset="100%" stopColor="#E0E0E0" />
                </linearGradient>

                {/* Strong Glow */}
                <filter id="neonGlow" x="-200%" y="-200%" width="400%" height="400%">
                    <feGaussianBlur stdDeviation="2.8" result="b" />
                    <feMerge>
                        <feMergeNode in="b" />
                        <feMergeNode in="b" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>

                {/* Soft Glow */}
                <filter id="softGlow" x="-100%" y="-100%" width="300%" height="300%">
                    <feGaussianBlur stdDeviation="1.5" result="b" />
                    <feMerge>
                        <feMergeNode in="b" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>

                <style>{`
          .node {
            fill: url(#redNeon);
            filter: url(#neonGlow);
            animation: pulse 2.2s ease-in-out infinite;
          }

          .node-white {
            fill: url(#whiteGrad);
            filter: url(#softGlow);
            animation: pulseWhite 2.2s ease-in-out infinite;
          }

          @keyframes pulse {
            0%,100% { opacity: 0.7; transform: scale(0.95); }
            50% { opacity: 1; transform: scale(1.1); }
          }

          @keyframes pulseWhite {
            0%,100% { opacity: 0.8; transform: scale(0.95); }
            50% { opacity: 1; transform: scale(1.08); }
          }

          .connection {
            stroke: url(#redNeon);
            stroke-width: 1.4;
            stroke-linecap: round;
            stroke-dasharray: 6 5;
            animation: flow 3s linear infinite;
          }

          .connection-white {
            stroke: url(#whiteGrad);
            stroke-width: 1.2;
            stroke-linecap: round;
            stroke-dasharray: 5 4;
            animation: flowWhite 3s linear infinite;
          }

          @keyframes flow {
            to { stroke-dashoffset: -22; }
          }

          @keyframes flowWhite {
            to { stroke-dashoffset: -18; }
          }

          .tassel {
            transform-origin: 22px 12px;
            transform:
              translateY(var(--scroll))
              rotate(calc(var(--dir) * 8deg));
            transition: transform 0.4s cubic-bezier(.4,0,.2,1);
          }

          .data-pulse {
            fill: #FFD1D1;
            filter: url(#neonGlow);
            animation: dataMove 1.6s ease-in-out infinite;
          }

          @keyframes dataMove {
            0% { transform: translateY(0); opacity: 1; }
            100% { transform: translateY(20px); opacity: 0; }
          }

          .outer-ring {
            stroke: url(#redNeon);
            stroke-width: 0.5;
            opacity: 0.2;
            animation: ringPulse 3s ease-in-out infinite;
          }

          @keyframes ringPulse {
            0%,100% { opacity: 0.15; }
            50% { opacity: 0.3; }
          }
        `}</style>
            </defs>

            {/* ===== AMBIENT GLOW RINGS ===== */}
            <ellipse cx="50" cy="28" rx="38" ry="18" className="outer-ring" fill="none" />
            <ellipse cx="50" cy="28" rx="32" ry="14" className="outer-ring" fill="none" style={{ animationDelay: '0.5s' }} />

            {/* ===== CAP NETWORK - RED ===== */}
            <path d="M50 12L18 28L50 44L82 28Z" className="connection" fill="none" />
            <path d="M50 12L34 20L18 28" className="connection" fill="none" opacity="0.6" />
            <path d="M50 12L66 20L82 28" className="connection" fill="none" opacity="0.6" />
            <path d="M18 28L34 36L50 44" className="connection" fill="none" opacity="0.5" />
            <path d="M82 28L66 36L50 44" className="connection" fill="none" opacity="0.5" />

            {/* Cross connections for more network effect */}
            <path d="M34 20L66 20" className="connection" fill="none" opacity="0.3" />
            <path d="M34 36L66 36" className="connection" fill="none" opacity="0.3" />

            {/* ===== MAIN NODES - RED ===== */}
            <circle cx="50" cy="12" r="4" className="node" />
            <circle cx="18" cy="28" r="3.5" className="node" />
            <circle cx="82" cy="28" r="3.5" className="node" />
            <circle cx="50" cy="44" r="4" className="node" />

            {/* ===== SECONDARY NODES - RED ===== */}
            <circle cx="34" cy="20" r="2.6" className="node" />
            <circle cx="66" cy="20" r="2.6" className="node" />
            <circle cx="34" cy="36" r="2.6" className="node" />
            <circle cx="66" cy="36" r="2.6" className="node" />

            {/* ===== CENTER NODE ===== */}
            <circle cx="50" cy="28" r="2" className="node" style={{ opacity: 0.5 }} />

            {/* ===== BOTTOM SECTION - WHITE (opposite direction - horizontal) ===== */}
            <path d="M35 54L50 44L65 54L50 64Z" className="connection-white" fill="none" />
            <path d="M35 54L50 64" className="connection-white" fill="none" opacity="0.6" />
            <path d="M65 54L50 64" className="connection-white" fill="none" opacity="0.6" />

            {/* White nodes */}
            <circle cx="35" cy="54" r="3" className="node-white" />
            <circle cx="65" cy="54" r="3" className="node-white" />
            <circle cx="50" cy="44" r="3" className="node-white" />
            <circle cx="50" cy="64" r="3.5" className="node-white" />
            <circle cx="42" cy="49" r="2" className="node-white" style={{ opacity: 0.7 }} />
            <circle cx="58" cy="49" r="2" className="node-white" style={{ opacity: 0.7 }} />

            {/* ===== TASSEL - FAR LEFT ===== */}
            <g className="tassel">
                <path d="M22 12L22 38" stroke="url(#redNeon)" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="22" cy="18" r="2.2" className="data-pulse" />
                <circle cx="22" cy="38" r="3" className="node" />

                {/* Tassel strands */}
                <path d="M22 38L16 58" stroke="url(#redNeon)" strokeWidth="1.2" strokeLinecap="round" />
                <path d="M22 38L22 60" stroke="url(#redNeon)" strokeWidth="1.3" strokeLinecap="round" />
                <path d="M22 38L28 58" stroke="url(#redNeon)" strokeWidth="1.2" strokeLinecap="round" />

                {/* Tassel end nodes */}
                <circle cx="16" cy="58" r="2.5" className="node" />
                <circle cx="22" cy="60" r="3" className="node" />
                <circle cx="28" cy="58" r="2.5" className="node" />
            </g>
        </svg>
    );
};

export default GraduationCapLogo;

