"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, LazyMotion, domAnimation, m } from "motion/react";
import { ArrowRight } from "lucide-react";
import { photos } from "@/lib/products";

// The hero is the only animated part of the site. LazyMotion + `m` keeps the motion bundle small.

const ease = [0.22, 1, 0.36, 1] as const;

const slides = [
  { src: photos.heroA, kicker: "Signature Collection", title: ["Everyday luxury,", "crafted for rest"] },
  { src: photos.heroB, kicker: "New in", title: ["Percale cotton", "for warm nights"] },
  { src: photos.heroC, kicker: "Comforter sets", title: ["Layered,", "not heavy"] },
];
const SLIDE_MS = 6000;

export default function Hero() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setI((n) => (n + 1) % slides.length), SLIDE_MS);
    return () => clearTimeout(t);
  }, [i]);

  const s = slides[i];

  return (
    <LazyMotion features={domAnimation} strict>
      <section className="relative h-[calc(100svh-88px)] min-h-[480px] sm:min-h-[540px] md:min-h-[600px] max-h-[860px] overflow-hidden bg-ink text-paper">
        <AnimatePresence initial={false}>
          <m.div
            key={i}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
          >
            <m.div
              className="absolute inset-0 will-change-transform"
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: SLIDE_MS / 1000 + 1.2, ease: "linear" }}
            >
              <Image
                src={s.src}
                alt=""
                fill
                priority={i === 0}
                fetchPriority={i === 0 ? "high" : "auto"}
                sizes="100vw"
                className="object-cover"
              />
            </m.div>
          </m.div>
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-black/10" />

        <div className="relative mx-auto flex h-full max-w-[1440px] flex-col justify-end px-4 pb-8 sm:px-6 sm:pb-12 md:px-10 md:pb-16">
          <AnimatePresence mode="wait">
            <m.div key={i} exit={{ opacity: 0, transition: { duration: 0.3 } }}>
              <div className="overflow-hidden">
                <m.p className="label mb-3 sm:mb-5 text-[10px] sm:text-[11px] tracking-[0.2em] opacity-90" initial={{ y: "100%" }} animate={{ y: 0 }} transition={{ duration: 0.7, delay: 0.3, ease }}>
                  {s.kicker}
                </m.p>
              </div>
              <h1 className="text-[clamp(2.1rem,6.2vw,6.5rem)] leading-[1.02] font-light tracking-[-0.03em] break-words">
                {s.title.map((l, k) => (
                  <span key={l} className="block overflow-hidden">
                    <m.span className="block" initial={{ y: "105%" }} animate={{ y: 0 }} transition={{ duration: 0.9, delay: 0.4 + k * 0.1, ease }}>
                      {l}
                    </m.span>
                  </span>
                ))}
              </h1>
            </m.div>
          </AnimatePresence>

          <div className="mt-8 flex flex-wrap items-end justify-between gap-6 sm:mt-10 sm:gap-8">
            <Link href="/shop" className="btn bg-paper text-ink transition-transform hover:scale-[1.02] active:scale-[0.98]">
              Shop now <ArrowRight size={14} />
            </Link>
            <div className="flex gap-2 sm:gap-3">
              {slides.map((sl, k) => (
                <button
                  key={sl.src}
                  onClick={() => setI(k)}
                  className="w-12 py-2 text-left sm:w-16 sm:py-3 md:w-24 transition-opacity hover:opacity-100"
                  aria-label={`Slide ${k + 1}`}
                >
                  <span className={`mb-1.5 block text-[10px] sm:text-[11px] ${k === i ? "opacity-100 font-medium" : "opacity-60"}`}>0{k + 1}</span>
                  <span className="block h-0.5 sm:h-px bg-paper/30">
                    {k === i && (
                      <m.span
                        className="block h-0.5 sm:h-px origin-left bg-paper"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: SLIDE_MS / 1000, ease: "linear" }}
                      />
                    )}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </LazyMotion>
  );
}
