"use client";

import gsap from "gsap";
import {
  type CSSProperties,
  useLayoutEffect,
  useMemo,
  useRef,
  useSyncExternalStore,
} from "react";

export type DreamyMeadowBackgroundProps = {
  className?: string;
  fixed?: boolean;
  fireflies?: "sparse" | "normal" | "dense";
};

function subscribeReducedMotion(onStoreChange: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", onStoreChange);
  return () => mq.removeEventListener("change", onStoreChange);
}

function getReducedMotionSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getReducedMotionServerSnapshot() {
  return false;
}

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );
}

function fireflySpecs(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    size: 2 + (i % 3),
    hue: 68 + (i % 18),
  }));
}

export default function DreamyMeadowBackground({
  className,
  fixed = true,
  fireflies = "normal",
}: DreamyMeadowBackgroundProps) {
  const count = fireflies === "sparse" ? 9 : fireflies === "dense" ? 24 : 16;
  const specs = useMemo(() => fireflySpecs(count), [count]);
  const firefliesRootRef = useRef<HTMLDivElement | null>(null);
  const reduceMotion = usePrefersReducedMotion();

  useLayoutEffect(() => {
    const root = firefliesRootRef.current;
    if (!root) return;

    const nodes = root.querySelectorAll<HTMLElement>("[data-firefly]");

    const ctx = gsap.context(() => {
      nodes.forEach((el) => {
        const left = gsap.utils.random(3, 94);
        const top = gsap.utils.random(8, 88);

        gsap.set(el, {
          left: `${left}%`,
          top: `${top}%`,
          x: 0,
          y: 0,
          visibility: "visible",
          force3D: true,
        });

        if (reduceMotion) {
          gsap.set(el, { autoAlpha: 0.38 });
          return;
        }

        gsap.set(el, { autoAlpha: 1 });

        gsap.to(el, {
          x: () => gsap.utils.random(-280, 280),
          y: () => gsap.utils.random(-240, 240),
          duration: () => gsap.utils.random(17, 26),
          delay: () => gsap.utils.random(0, 2.8),
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          repeatRefresh: true,
        });

        gsap.to(el, {
          opacity: () => gsap.utils.random(0.1, 1),
          scale: () => gsap.utils.random(0.82, 1.18),
          duration: () => gsap.utils.random(1, 3),
          delay: () => gsap.utils.random(0, 1.5),
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          repeatRefresh: true,
        });
      });
    }, root);

    return () => ctx.revert();
  }, [count, reduceMotion]);

  const positionClass = fixed
    ? "pointer-events-none fixed inset-0 -z-10"
    : "pointer-events-none absolute inset-0";

  return (
    <div
      aria-hidden
      className={[positionClass, "overflow-hidden", className].filter(Boolean).join(" ")}
    >
      <div className="absolute inset-0 bg-linear-to-b from-[#0b1424] via-[#0d1e30] to-[#050910]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_55%_at_50%_-15%,rgba(110,180,255,0.14),transparent_58%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_45%_at_75%_10%,rgba(74,222,128,0.08),transparent_50%)]" />

      <div className="dreamy-mist-animate absolute -bottom-32 left-[-15%] right-[-15%] h-[62%] rounded-[100%] bg-linear-to-t from-emerald-950/35 via-teal-950/18 to-transparent blur-3xl opacity-90" />
      <div className="absolute bottom-0 left-[-20%] right-[-20%] h-[48%] bg-linear-to-t from-[#030806]/85 via-emerald-950/25 to-transparent blur-2xl" />

      <svg
        className="absolute bottom-[-6%] left-1/2 h-[min(46vh,440px)] w-[min(140vw,2000px)] -translate-x-1/2 text-[#07140f]"
        viewBox="0 0 1440 280"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="dreamy-grass-back" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0b2418" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#020604" stopOpacity="1" />
          </linearGradient>
          <linearGradient id="dreamy-grass-front" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#13402e" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#030806" stopOpacity="1" />
          </linearGradient>
          <filter id="dreamy-grass-blur" x="-5%" y="-5%" width="110%" height="110%">
            <feGaussianBlur stdDeviation="2.2" />
          </filter>
        </defs>
        <path
          fill="url(#dreamy-grass-back)"
          filter="url(#dreamy-grass-blur)"
          d="M0,280 L0,165 C180,120 320,195 520,150 C700,110 820,175 980,135 C1120,100 1260,155 1440,125 L1440,280 Z"
        />
        <path
          fill="url(#dreamy-grass-front)"
          d="M0,280 L0,188 C160,155 280,205 460,168 C640,132 760,210 940,172 C1080,142 1220,198 1440,158 L1440,280 Z"
        />
        <path
          fill="currentColor"
          opacity="0.55"
          d="M0,280 L0,210 C220,185 380,235 560,205 C740,176 860,228 1040,198 C1180,178 1320,218 1440,195 L1440,280 Z"
        />
      </svg>

      <div className="absolute inset-0 bg-linear-to-t from-transparent via-transparent to-[rgba(6,12,18,0.35)]" />
      <div className="absolute bottom-0 left-0 right-0 h-[38%] bg-linear-to-t from-emerald-950/15 to-transparent blur-sm" />

      <div ref={firefliesRootRef} className="absolute inset-0">
        {specs.map((f, i) => (
          <span
            key={i}
            data-firefly
            className="dreamy-firefly-node absolute rounded-full will-change-transform"
            style={
              {
                visibility: "hidden",
                width: f.size,
                height: f.size,
                backgroundColor: `hsla(${f.hue}, 95%, 78%, 0.95)`,
                boxShadow: `0 0 ${6 + f.size}px ${2 + f.size}px hsla(${f.hue}, 100%, 70%, 0.35)`,
              } as CSSProperties
            }
          />
        ))}
      </div>
    </div>
  );
}
