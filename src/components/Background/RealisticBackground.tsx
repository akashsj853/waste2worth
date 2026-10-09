import React, { useEffect, useRef } from 'react';
import { BackgroundSettings } from '../../types/background';
import soilTextureUrl from '../../assets/images/organic_eco_soil_texture_1791527861240.jpg';
import labTextureUrl from '../../assets/images/circular_recovery_lab_1791527886025.jpg';

interface RealisticBackgroundProps {
  settings: BackgroundSettings;
}

export const RealisticBackground: React.FC<RealisticBackgroundProps> = ({ settings }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Environmental Floating Spores / Air Motes Particle Simulation
  useEffect(() => {
    if (!settings.showParticles) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Particle parameters based on current theme
    const particleCount = settings.theme === 'twilight-slate' ? 36 : 24;
    const particles: Array<{
      x: number;
      y: number;
      radius: number;
      vx: number;
      vy: number;
      alpha: number;
      baseAlpha: number;
      color: string;
      phase: number;
    }> = [];

    const getParticleColor = (theme: string) => {
      switch (theme) {
        case 'biosphere':
          return '245, 195, 68'; // Golden pollen / warm compost dust
        case 'circular-lab':
          return '52, 211, 153'; // Clean room botanical green mote
        case 'topographic':
          return '14, 165, 233'; // GIS geo-spatial cyan photon
        case 'twilight-slate':
          return '110, 231, 183'; // Bioluminescent chlorophyll spore
        case 'clean-studio':
        default:
          return '168, 162, 158'; // Neutral warm fiber mote
      }
    };

    const rgbColor = getParticleColor(settings.theme);

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2.2 + 0.8,
        vx: (Math.random() - 0.5) * 0.25,
        vy: -(Math.random() * 0.35 + 0.1), // Gentle natural upward convective drift
        alpha: Math.random() * 0.4 + 0.1,
        baseAlpha: Math.random() * 0.35 + 0.15,
        color: rgbColor,
        phase: Math.random() * Math.PI * 2,
      });
    }

    let lastTime = performance.now();

    const render = (time: number) => {
      const delta = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.vx * (delta * 60);
        p.y += p.vy * (delta * 60);
        p.phase += delta * 1.5;

        // Subtle sine pulsation
        p.alpha = p.baseAlpha + Math.sin(p.phase) * 0.12;
        if (p.alpha < 0.05) p.alpha = 0.05;

        // Wrap around boundaries
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        // Render soft glowing mote
        ctx.beginPath();
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 2.5);
        gradient.addColorStop(0, `rgba(${p.color}, ${Math.min(p.alpha, 0.7)})`);
        gradient.addColorStop(1, `rgba(${p.color}, 0)`);
        ctx.fillStyle = gradient;
        ctx.arc(p.x, p.y, p.radius * 2.5, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [settings.showParticles, settings.theme]);

  // Determine theme-specific CSS background styles
  const getThemeBaseStyles = () => {
    switch (settings.theme) {
      case 'biosphere':
        return {
          baseBg: 'bg-[#f4efe6]', // Rich warm organic parchment/compost tone
          vignette: 'rgba(56, 41, 26, 0.25)',
        };
      case 'circular-lab':
        return {
          baseBg: 'bg-[#eef5f1]', // Architectural clean eco-facility pale sage
          vignette: 'rgba(20, 50, 35, 0.20)',
        };
      case 'topographic':
        return {
          baseBg: 'bg-[#f2f4f7]', // Precision surveyor light blueprint gray
          vignette: 'rgba(15, 23, 42, 0.22)',
        };
      case 'twilight-slate':
        return {
          baseBg: 'bg-[#0b1411]', // Nocturnal botanical earth slate
          vignette: 'rgba(0, 0, 0, 0.60)',
        };
      case 'clean-studio':
      default:
        return {
          baseBg: 'bg-[#f5f5f4]', // Warm stone gallery tone
          vignette: 'rgba(28, 25, 23, 0.15)',
        };
    }
  };

  const { baseBg } = getThemeBaseStyles();

  return (
    <div
      className={`fixed inset-0 pointer-events-none z-0 overflow-hidden transition-colors duration-700 ${baseBg}`}
      aria-hidden="true"
    >
      {/* 1. Realistic Photographic Material Backdrop */}
      {settings.theme === 'biosphere' && (
        <div
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-700"
          style={{
            backgroundImage: `url(${soilTextureUrl})`,
            opacity: settings.intensity,
            filter: `blur(${settings.blurAmount}px) saturate(1.15)`,
            mixBlendMode: 'multiply',
          }}
        />
      )}

      {settings.theme === 'circular-lab' && (
        <div
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-700"
          style={{
            backgroundImage: `url(${labTextureUrl})`,
            opacity: settings.intensity,
            filter: `blur(${settings.blurAmount}px) contrast(1.05)`,
            mixBlendMode: 'multiply',
          }}
        />
      )}

      {/* 2. Natural Ambient Daylight & Caustic Illumination */}
      {settings.showSunlight && (
        <>
          {/* Top-Right Golden Sunlight Flare (Photosynthesis / Morning Sky) */}
          <div
            className="absolute -top-32 -right-32 w-[700px] h-[700px] rounded-full transition-opacity duration-700"
            style={{
              background:
                settings.theme === 'twilight-slate'
                  ? 'radial-gradient(circle, rgba(16, 185, 129, 0.18) 0%, rgba(5, 150, 105, 0.05) 50%, transparent 75%)'
                  : 'radial-gradient(circle, rgba(254, 240, 138, 0.45) 0%, rgba(251, 191, 36, 0.18) 40%, rgba(245, 158, 11, 0.05) 65%, transparent 80%)',
              filter: 'blur(60px)',
            }}
          />

          {/* Bottom-Left Chlorophyll & Flora Ambient Bounce Light */}
          <div
            className="absolute -bottom-40 -left-40 w-[800px] h-[800px] rounded-full transition-opacity duration-700"
            style={{
              background:
                settings.theme === 'twilight-slate'
                  ? 'radial-gradient(circle, rgba(6, 78, 59, 0.4) 0%, rgba(4, 47, 46, 0.15) 50%, transparent 80%)'
                  : 'radial-gradient(circle, rgba(16, 185, 129, 0.22) 0%, rgba(52, 211, 153, 0.10) 45%, rgba(110, 231, 183, 0.03) 70%, transparent 85%)',
              filter: 'blur(70px)',
            }}
          />

          {/* Center-East Warm Compost / Soil Horizon Hearth Glow */}
          {settings.theme === 'biosphere' && (
            <div
              className="absolute top-1/3 -right-20 w-[600px] h-[600px] rounded-full transition-opacity duration-700"
              style={{
                background:
                  'radial-gradient(circle, rgba(217, 119, 6, 0.14) 0%, rgba(180, 83, 9, 0.05) 50%, transparent 75%)',
                filter: 'blur(80px)',
              }}
            />
          )}
        </>
      )}

      {/* 3. Tactile Recycled Paper & Kraft Fiber Micro-Texture (SVG noise grain) */}
      {settings.showFiberTexture && (
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.055] mix-blend-color-burn"
          xmlns="http://www.w3.org/2000/svg"
        >
          <filter id="recycled-paper-fiber">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.65"
              numOctaves="3"
              stitchTiles="stitch"
            />
            <feColorMatrix
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
            />
          </filter>
          <rect width="100%" height="100%" filter="url(#recycled-paper-fiber)" />
        </svg>
      )}

      {/* 4. Realistic Vector GIS Topographical Elevation Contours */}
      {settings.showContours && (
        <div
          className={`absolute inset-0 transition-opacity duration-700 ${
            settings.theme === 'twilight-slate' ? 'opacity-20' : 'opacity-15'
          }`}
        >
          <svg
            className="w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 900"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              <linearGradient id="contour-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop
                  offset="0%"
                  stopColor={settings.theme === 'twilight-slate' ? '#34d399' : '#059669'}
                  stopOpacity="0.8"
                />
                <stop
                  offset="100%"
                  stopColor={settings.theme === 'twilight-slate' ? '#38bdf8' : '#d97706'}
                  stopOpacity="0.4"
                />
              </linearGradient>
            </defs>

            {/* Topographical Contour Elevation Bands */}
            <g
              stroke="url(#contour-grad)"
              strokeWidth="1.25"
              fill="none"
              strokeLinecap="round"
              strokeDasharray="6 3"
            >
              {/* Level 01 */}
              <path d="M-100,120 C300,80 500,240 900,180 C1200,140 1400,260 1600,220" />
              {/* Level 02 */}
              <path d="M-100,240 C280,210 520,380 950,310 C1250,270 1420,410 1600,370" />
              {/* Level 03 (Index Contour - Solid) */}
              <path
                d="M-100,360 C260,330 550,510 1000,430 C1300,390 1450,560 1600,520"
                strokeWidth="1.8"
                strokeDasharray="none"
              />
              {/* Level 04 */}
              <path d="M-100,490 C240,460 580,640 1040,560 C1350,510 1480,700 1600,670" />
              {/* Level 05 */}
              <path d="M-100,620 C220,590 620,770 1090,690 C1400,640 1510,840 1600,810" />
              {/* Level 06 (Index Contour - Solid) */}
              <path
                d="M-100,750 C200,720 660,890 1140,820 C1440,780 1530,970 1600,950"
                strokeWidth="1.8"
                strokeDasharray="none"
              />
            </g>

            {/* Circular Circularity Closed Horizon Loops (representing closed-loop resource recovery) */}
            <g
              stroke={settings.theme === 'twilight-slate' ? '#6ee7b7' : '#10b981'}
              strokeWidth="1.2"
              fill="none"
              opacity="0.6"
            >
              <ellipse cx="280" cy="580" rx="160" ry="85" transform="rotate(-15 280 580)" />
              <ellipse cx="280" cy="580" rx="110" ry="55" transform="rotate(-15 280 580)" />
              <ellipse cx="1180" cy="320" rx="200" ry="95" transform="rotate(18 1180 320)" />
              <ellipse cx="1180" cy="320" rx="140" ry="65" transform="rotate(18 1180 320)" />
            </g>

            {/* Subtle GIS Topographic Elevation Markers */}
            <g
              fontSize="9"
              fontFamily="monospace"
              fill={settings.theme === 'twilight-slate' ? '#6ee7b7' : '#047857'}
              opacity="0.75"
            >
              <text x="560" y="505">EL. 120m</text>
              <text x="1010" y="425">EL. 140m</text>
              <text x="1200" y="315">RECYCLE NODE · 84m</text>
              <text x="260" y="575">COMPOST HORIZON · 92m</text>
            </g>
          </svg>
        </div>
      )}

      {/* 5. Precision Technical Grid for Circular Facility & Topographic modes */}
      {(settings.theme === 'circular-lab' || settings.theme === 'topographic') && (
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(to right, #000 1px, transparent 1px),
              linear-gradient(to bottom, #000 1px, transparent 1px)
            `,
            backgroundSize: '48px 48px',
          }}
        />
      )}

      {/* 6. Environmental Floating Motes / Spore Canvas */}
      {settings.showParticles && (
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />
      )}

      {/* 7. Atmospheric Perimeter Vignette (Framing the viewport for focused work) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            settings.theme === 'twilight-slate'
              ? 'radial-gradient(ellipse at 50% 45%, transparent 50%, rgba(2, 6, 23, 0.65) 100%)'
              : 'radial-gradient(ellipse at 50% 45%, transparent 55%, rgba(41, 37, 36, 0.14) 100%)',
        }}
      />
    </div>
  );
};
