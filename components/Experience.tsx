"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects } from "@/lib/projects";
import { site } from "@/lib/site";

const HeroScene = dynamic(() => import("./scenes/HeroScene"), {
  ssr: false,
  loading: () => <div className="webgl-loading hero-fallback" aria-hidden="true" />,
});
const WorkScene = dynamic(() => import("./scenes/WorkScene"), {
  ssr: false,
  loading: () => <div className="webgl-loading gallery-fallback" aria-hidden="true" />,
});

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return diagonal ? (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M5 19 19 5M7 5h12v12" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M4 12h16m-7-7 7 7-7 7" />
    </svg>
  );
}

function DownArrow() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M12 3v18m-7-7 7 7 7-7" />
    </svg>
  );
}

function ProjectModal({ index, onClose }: { index: number; onClose: () => void }) {
  const project = projects[index];
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const before = document.activeElement as HTMLElement | null;
    const keyHandler = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", keyHandler);
    document.body.classList.add("modal-open");
    closeRef.current?.focus();
    return () => {
      window.removeEventListener("keydown", keyHandler);
      document.body.classList.remove("modal-open");
      before?.focus();
    };
  }, [onClose]);

  return (
    <div className="modal-shell" role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <section className="modal-card" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <button type="button" ref={closeRef} className="modal-close" aria-label="Close project details" onClick={onClose}>×</button>
        <div className={`modal-art modal-art--${project.artwork}`} style={{ "--art1": project.colors[0], "--art2": project.colors[1], "--art3": project.colors[2] } as CSSProperties}>
          <span>SELECTED PROJECT / {project.number}</span>
          <strong>{project.title}</strong>
          <span>AN ORIGINAL AETHER CONCEPT</span>
        </div>
        <div className="modal-content">
          <p className="eyebrow"><span className="diamond" /> PROJECT FIELD NOTES / {project.year}</p>
          <h2 id="modal-title">{project.title}</h2>
          <p>{project.story}</p>
          <div className="modal-footer"><span>{project.category}</span><span>CONCEPT STUDY · NOT CLIENT WORK</span></div>
          <button className="text-link" type="button" onClick={onClose}>BACK TO THE EXPERIENCE <Arrow /></button>
        </div>
      </section>
    </div>
  );
}

export default function Experience() {
  const rootRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const workRef = useRef<HTMLElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [active, setActive] = useState(0);
  const [modalIndex, setModalIndex] = useState<number | null>(null);
  const [motionEnabled, setMotionEnabled] = useState(true);
  const [heroVisible, setHeroVisible] = useState(true);
  const [workVisible, setWorkVisible] = useState(false);
  const activeProject = projects[active];

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setMotionEnabled(!media.matches);
    const onChange = () => setMotionEnabled(!media.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target === heroRef.current) setHeroVisible(entry.isIntersecting);
          if (entry.target === workRef.current) setWorkVisible(entry.isIntersecting);
        });
      },
      { rootMargin: "85% 0px 85% 0px" },
    );
    if (heroRef.current) observer.observe(heroRef.current);
    if (workRef.current) observer.observe(workRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      ScrollTrigger.create({
        trigger: workRef.current,
        start: "top top",
        end: "bottom bottom",
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const position = Math.max(0, Math.min(1, self.progress));
          setScrollProgress(position);
          setActive(Math.min(projects.length - 1, Math.round(position * (projects.length - 1))));
        },
        onLeave: () => { setScrollProgress(1); setActive(projects.length - 1); },
        onEnterBack: () => { setScrollProgress(1); setActive(projects.length - 1); },
        onLeaveBack: () => { setScrollProgress(0); setActive(0); },
      });
      if (motionEnabled) {
        gsap.fromTo(".hero-reveal", { y: 38, opacity: 0 }, { y: 0, opacity: 1, duration: 1.25, stagger: 0.16, ease: "power3.out", delay: 0.2 });
        gsap.fromTo(".contact-reveal", { y: 56, opacity: 0 }, {
          y: 0, opacity: 1, duration: 1.1, stagger: 0.15, ease: "power3.out",
          scrollTrigger: { trigger: ".contact", start: "top 72%", once: true },
        });
      }
    }, rootRef);
    const refresh = window.setTimeout(() => ScrollTrigger.refresh(), 200);
    return () => { window.clearTimeout(refresh); context.revert(); };
  }, [motionEnabled]);

  const jumpToProject = useCallback((index: number) => {
    const section = workRef.current;
    if (!section) return;
    const total = section.offsetHeight - window.innerHeight;
    const top = window.scrollY + section.getBoundingClientRect().top;
    window.scrollTo({ top: top + total * (Math.max(0, Math.min(index, projects.length - 1)) / (projects.length - 1)), behavior: motionEnabled ? "smooth" : "instant" });
  }, [motionEnabled]);

  const closeModal = useCallback(() => setModalIndex(null), []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (modalIndex !== null) return;
      const target = event.target as HTMLElement;
      if (["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)) return;
      const section = workRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      if (rect.top > 70 || rect.bottom < window.innerHeight - 70) return;
      if (event.key === "ArrowRight") { event.preventDefault(); jumpToProject(active + 1); }
      if (event.key === "ArrowLeft") { event.preventDefault(); jumpToProject(active - 1); }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active, modalIndex, jumpToProject]);

  return (
    <div className="site" ref={rootRef}>
      <a className="skip-link" href="#work">Skip to selected work</a>
      <header className="site-header">
        <a href="#top" className="brand" aria-label="Aether studio, return to top">
          <span className="brand-symbol" aria-hidden="true"><span /></span>
          <span className="brand-name">AETHER<span>®</span><small>EXPERIMENTAL DIGITAL STUDIO</small></span>
        </a>
        <div className="header-middle">INDEPENDENT BY DESIGN <span>✧</span> WORLDWIDE BY NATURE</div>
        <nav className="header-nav" aria-label="Main navigation">
          <a href="#work">WORK</a><i aria-hidden="true" /><a href="#contact">CONTACT</a>
        </nav>
      </header>

      <main>
        <section id="top" className="hero" ref={heroRef} aria-labelledby="hero-title">
          <div className="hero-atmosphere" aria-hidden="true" />
          <div className="hero-canvas" aria-hidden="true">{heroVisible && <HeroScene animated={motionEnabled} />}</div>
          <div className="hero-topline hero-reveal"><span>CREATIVE DEVELOPMENT / 001</span><span>EST. IN THE IMAGINATION</span></div>
          <div className="hero-copy">
            <p className="eyebrow hero-reveal"><span className="diamond" /> AT THE INTERSECTION OF ART & TECHNOLOGY</p>
            <h1 id="hero-title" className="hero-reveal">THE FUTURE<br /><em>FEELS</em><br />DIFFERENT<span className="hero-period">.</span></h1>
            <p className="hero-subcopy hero-reveal">We create digital experiences that live somewhere between imagination and reality.</p>
            <a className="hero-explore hero-reveal" href="#work"><span>EXPLORE THE UNKNOWN</span><span className="round-arrow"><Arrow diagonal /></span></a>
          </div>
          <div className="hero-axis hero-reveal" aria-hidden="true">48° 51′ 29.6″ / 0024</div>
          <div className="hero-bottom">
            <span>© 2026 AETHER® — CONCEPT STUDIO</span>
            <a href="#work" className="scroll-prompt">SCROLL TO ENTER THE EXPERIENCE <DownArrow /></a>
            <button type="button" className="motion-toggle" onClick={() => setMotionEnabled((value) => !value)} aria-pressed={motionEnabled} aria-label={motionEnabled ? "Pause animation" : "Enable animation"}>
              <span className={motionEnabled ? "motion-indicator motion-indicator--on" : "motion-indicator"} /> MOTION {motionEnabled ? "ON" : "OFF"}
            </button>
          </div>
        </section>

        <section id="work" className="work" ref={workRef} aria-label="Selected work interactive gallery">
          <div className="work-sticky">
            <div className="work-atmosphere" aria-hidden="true" style={{ "--active-accent": activeProject.accent } as CSSProperties} />
            <div className="work-canvas" aria-hidden="true">{workVisible && <WorkScene progress={scrollProgress} animated={motionEnabled} onOpen={setModalIndex} />}</div>
            <div className="work-heading"><span className="work-kicker"><span className="diamond" /> SELECTED WORK <span className="work-year">/ 2025—2026</span></span><span>AN EXPLORATION OF WHAT'S POSSIBLE</span></div>
            <div className="work-text" key={activeProject.id} aria-live="polite" aria-atomic="true">
              <div className="work-number">{activeProject.number}<span> / 06</span></div>
              <p className="eyebrow work-field">{activeProject.kicker}</p>
              <h2>{activeProject.title}</h2>
              <p className="work-description">{activeProject.description}</p>
              <div className="work-tags"><span>{activeProject.category}</span><span>{activeProject.year}</span></div>
              <button type="button" className="work-cta" onClick={() => setModalIndex(active)}><span>EXPLORE THIS PROJECT</span><span className="round-arrow"><Arrow diagonal /></span></button>
            </div>
            <div className="work-side"><span>SCROLL TO EXPLORE</span><div className="work-progress" role="progressbar" aria-valuemin={1} aria-valuemax={projects.length} aria-valuenow={active + 1} aria-label="Project number"><div style={{ transform: `scaleY(${Math.max(0.03, scrollProgress)})` }} /></div><strong>{String(active + 1).padStart(2, "0")} / 06</strong></div>
            <div className="work-bottom"><div className="work-index">{projects.map((p, index) => <button key={p.id} type="button" className={index === active ? "work-index-item is-active" : "work-index-item"} aria-label={`View ${p.title}`} aria-current={index === active ? "step" : undefined} onClick={() => jumpToProject(index)}>{p.number}<span /></button>)}</div><div className="work-arrows"><button type="button" aria-label="Previous project" disabled={active === 0} onClick={() => jumpToProject(active - 1)}>←</button><button type="button" aria-label="Next project" disabled={active === projects.length - 1} onClick={() => jumpToProject(active + 1)}>→</button></div></div>
          </div>
        </section>

        <section id="about" className="manifesto" aria-labelledby="manifesto-title"><div className="manifesto-label"><span className="diamond" /> OUR PHILOSOPHY <span>01 / 01</span></div><div className="manifesto-copy"><span className="manifesto-asterisk">✳</span><h2 id="manifesto-title">WE DON'T JUST<br />BUILD <em>WEBSITES.</em><br />WE BUILD <em>WONDER.</em></h2><p>Interaction is a language. Motion is a feeling. Technology is simply the canvas.</p></div><div className="manifesto-bottom"><span>DESIGN × CODE × EMOTION</span><span>ALWAYS CURIOUS, NEVER ORDINARY</span></div></section>

        <section id="contact" className="contact" aria-labelledby="contact-title"><div className="contact-glow" aria-hidden="true"><div className="contact-orbit contact-orbit-one" /><div className="contact-orbit contact-orbit-two" /><div className="contact-orbit contact-orbit-three" /></div><p className="eyebrow contact-eyebrow contact-reveal"><span className="diamond" /> HAVE SOMETHING IMPOSSIBLE IN MIND?</p><h2 id="contact-title" className="contact-reveal">LET'S MAKE<br /><em>IT REAL.</em></h2><a href={`mailto:${site.contactEmail}?subject=${encodeURIComponent("Let's make something extraordinary")}`} className="contact-button contact-reveal">START A CONVERSATION <span><Arrow diagonal /></span></a><p className="contact-disclosure">PORTFOLIO CONCEPT · EDIT THE DEMO EMAIL IN <code>lib/site.ts</code></p><footer><div className="footer-brand">AETHER<sup>®</sup></div><div className="footer-right"><span>IMAGINED & BUILT FOR THE WEB</span><a href="#top">BACK TO TOP ↑</a><span>© 2026 AETHER CONCEPT</span></div></footer></section>
      </main>
      {modalIndex !== null && <ProjectModal index={modalIndex} onClose={closeModal} />}
    </div>
  );
}
